# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Python project (`myproject`) using a flat package layout.

## Commands

- **Install**: `pip install -e .`
- **Test**: `pytest`
- **Test single**: `pytest tests/test_main.py::test_main`
- **Lint**: `ruff check .`
- **Format check**: `ruff format --check .`
- **Format**: `ruff format .`

## Structure

```
myproject/       — Main package
tests/           — Tests (pytest)
Scripts/         — Utility scripts
pyproject.toml   — Project config, tool settings
```
