#!/usr/bin/env python3
"""
Best Buy Price Tracker - ASUS Zenbook S14 (UX5406SA)
=====================================================
Checks Best Buy for the current price and sends an email alert
when the price drops to your target or below.

Run manually, or schedule with Windows Task Scheduler / cron.

Setup:
  1. pip install requests beautifulsoup4
  2. Copy .env.example to .env and fill in your email settings
  3. Run: python bestbuy_price_tracker.py
"""

import csv
import json
import re
import smtplib
import sys
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ============================================================
# CONFIG - Edit these values
# ============================================================

# Product to track
PRODUCT_NAME = "ASUS Zenbook S 14 (UX5406SA) - 32GB/1TB - Zumaia Gray"
PRODUCT_URL = "https://www.bestbuy.com/site/asus-zenbook-s-14-14-3k-oled-touch-screen-laptop-copilot-pc-intel-core-ultra-7-32gb-ram-1tb-ssd-zumaia-gray/6615730.p?skuId=6615730"
SKU = "6615730"

# Price alert threshold
TARGET_PRICE = 1299.00  # Send alert when price is at or below this

# Email settings - loaded from .env file in the same directory
# Copy .env.example to .env and fill in your credentials.
# To create a Gmail App Password:
#   1. Go to myaccount.google.com > Security > 2-Step Verification (enable if needed)
#   2. At the bottom, click "App passwords"
#   3. Create one for "Mail" on "Windows Computer"
#   4. Use the 16-character password below
EMAIL_ENABLED = True
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


def _load_env():
    """Load email config from .env file next to this script."""
    env_path = Path(__file__).parent / ".env"
    env_vars = {}
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                env_vars[key.strip()] = value.strip()
    return env_vars


_env = _load_env()
SENDER_EMAIL = _env.get("SENDER_EMAIL", "your.email@gmail.com")
SENDER_PASSWORD = _env.get("SENDER_PASSWORD", "xxxx xxxx xxxx xxxx")
RECIPIENT_EMAIL = _env.get("RECIPIENT_EMAIL", "your.email@gmail.com")

# File paths (price history log)
SCRIPT_DIR = Path(__file__).parent
PRICE_LOG = SCRIPT_DIR / "price_history.csv"
LAST_ALERT_FILE = SCRIPT_DIR / ".last_alert_price"

# ============================================================
# END CONFIG
# ============================================================


def get_price():
    """Fetch the current price from Best Buy's product page."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/131.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
    }

    try:
        response = requests.get(PRODUCT_URL, headers=headers, timeout=30)
        response.raise_for_status()
        html = response.text

        # Method 1: Look for JSON-LD structured data (most reliable)
        soup = BeautifulSoup(html, "html.parser")
        for script_tag in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script_tag.string)
                if isinstance(data, dict):
                    price = _extract_price_from_jsonld(data)
                    if price:
                        return price
                elif isinstance(data, list):
                    for item in data:
                        price = _extract_price_from_jsonld(item)
                        if price:
                            return price
            except (json.JSONDecodeError, TypeError):
                continue

        # Method 2: Look for price in common Best Buy price elements
        price_selectors = [
            '[data-testid="customer-price"] span',
            '.priceView-hero-price span[aria-hidden="true"]',
            '.priceView-customer-price span[aria-hidden="true"]',
            'div[class*="pricing"] span[aria-hidden="true"]',
        ]
        for selector in price_selectors:
            el = soup.select_one(selector)
            if el:
                price = _parse_price_text(el.get_text())
                if price:
                    return price

        # Method 3: Regex fallback - look for price patterns in HTML
        price_patterns = [
            r'"currentPrice"\s*:\s*([\d.]+)',
            r'"price"\s*:\s*"?\$([\d,]+\.?\d*)"?',
            r'"customerPrice"\s*:\s*"?\$([\d,]+\.?\d*)"?',
            r'data-testid="customer-price"[^>]*>\s*\$?([\d,]+\.\d{2})',
        ]
        for pattern in price_patterns:
            match = re.search(pattern, html)
            if match:
                try:
                    return float(match.group(1).replace(",", ""))
                except ValueError:
                    continue

        # Method 4: Check for "Sold Out" indicators
        sold_out_phrases = ["sold out", "coming soon", "unavailable"]
        if any(phrase in html.lower() for phrase in sold_out_phrases):
            print("[!] Product appears to be sold out or unavailable.")
            return None

        print(
            "[!] Could not extract price from page."
            " Best Buy may have changed their layout."
        )
        print(
            "    Try opening the URL in a browser to verify"
            " the product is still listed."
        )
        return None

    except requests.exceptions.RequestException as e:
        print(f"[!] Network error fetching Best Buy: {e}")
        return None


def _extract_price_from_jsonld(data):
    """Extract price from JSON-LD structured data."""
    if not isinstance(data, dict):
        return None

    # Direct offers
    offers = data.get("offers", {})
    if isinstance(offers, dict):
        price = offers.get("price") or offers.get("lowPrice")
        if price:
            try:
                return float(price)
            except (ValueError, TypeError):
                pass
    elif isinstance(offers, list):
        for offer in offers:
            price = offer.get("price") or offer.get("lowPrice")
            if price:
                try:
                    return float(price)
                except (ValueError, TypeError):
                    continue
    return None


def _parse_price_text(text):
    """Parse a price string like '$1,199.99' into a float."""
    match = re.search(r"[\$]?([\d,]+\.?\d*)", text)
    if match:
        try:
            return float(match.group(1).replace(",", ""))
        except ValueError:
            pass
    return None


def log_price(price, status="ok"):
    """Append price to CSV log."""
    file_exists = PRICE_LOG.exists()
    with open(PRICE_LOG, "a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(
                [
                    "timestamp",
                    "product",
                    "sku",
                    "price",
                    "target",
                    "status",
                ]
            )
        writer.writerow(
            [
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                PRODUCT_NAME,
                SKU,
                f"{price:.2f}" if price else "N/A",
                f"{TARGET_PRICE:.2f}",
                status,
            ]
        )


def should_send_alert(price):
    """Only send alert if price changed since last alert (avoid spam)."""
    if not LAST_ALERT_FILE.exists():
        return True
    try:
        last_price = float(LAST_ALERT_FILE.read_text().strip())
        return price != last_price
    except (ValueError, OSError):
        return True


def record_alert(price):
    """Record the price we alerted on to avoid duplicate alerts."""
    LAST_ALERT_FILE.write_text(str(price))


def send_email_alert(price):
    """Send an email notification about the price drop."""
    if not EMAIL_ENABLED:
        return

    if SENDER_EMAIL == "your.email@gmail.com":
        print(
            "[!] Email not configured — update SENDER_EMAIL and SENDER_PASSWORD in .env"
        )
        print(f"    ALERT: Price is ${price:.2f} (target: ${TARGET_PRICE:.2f})")
        return

    subject = f"🔥 Price Alert: Zenbook S14 is ${price:.2f}!"

    body = f"""
Price Drop Alert!
{"=" * 50}

{PRODUCT_NAME}
Current Price:  ${price:.2f}
Your Target:    ${TARGET_PRICE:.2f}
Savings:        ${TARGET_PRICE - price:.2f} under target!

Buy Now: {PRODUCT_URL}

{"=" * 50}
Checked at: {datetime.now().strftime("%Y-%m-%d %I:%M %p")}

-- Best Buy Price Tracker
"""

    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECIPIENT_EMAIL
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
        print(f"[✓] Alert email sent to {RECIPIENT_EMAIL}")
        record_alert(price)
    except smtplib.SMTPAuthenticationError:
        print("[!] Email authentication failed. Check your App Password.")
        print("    See: https://myaccount.google.com/apppasswords")
    except Exception as e:
        print(f"[!] Failed to send email: {e}")


def print_price_history():
    """Print recent price history from the log."""
    if not PRICE_LOG.exists():
        return
    print(f"\nRecent price history ({PRICE_LOG}):")
    print("-" * 60)
    with open(PRICE_LOG, "r") as f:
        reader = list(csv.reader(f))
        if len(reader) <= 1:
            return
        # Show header + last 10 entries
        print(f"  {'Date':<22} {'Price':>10} {'Status':<10}")
        for row in reader[-10:]:
            if row[0] == "timestamp":
                continue
            print(f"  {row[0]:<22} {'$' + row[3]:>10} {row[5]:<10}")
    print()


def main():
    print(f"{'=' * 60}")
    print("  Best Buy Price Tracker")
    print(f"  {PRODUCT_NAME}")
    print(f"  Target: ${TARGET_PRICE:.2f}")
    print(f"  {datetime.now().strftime('%Y-%m-%d %I:%M %p')}")
    print(f"{'=' * 60}\n")

    # Fetch current price
    print("[*] Checking Best Buy...")
    price = get_price()

    if price is None:
        print("[!] Could not determine current price.")
        log_price(None, status="error")
        print_price_history()
        return 1

    print(f"[✓] Current price: ${price:.2f}")

    # Log it
    if price <= TARGET_PRICE:
        status = "DEAL"
        print(
            f"[🔥] PRICE IS AT OR BELOW TARGET! (${price:.2f} <= ${TARGET_PRICE:.2f})"
        )
        log_price(price, status)
        if should_send_alert(price):
            send_email_alert(price)
        else:
            print("[*] Alert already sent for this price — skipping duplicate email.")
    else:
        status = "above_target"
        diff = price - TARGET_PRICE
        print(f"[—] ${diff:.2f} above your target of ${TARGET_PRICE:.2f}")
        log_price(price, status)

    print_price_history()
    return 0


if __name__ == "__main__":
    sys.exit(main())
