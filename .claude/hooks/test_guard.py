#!/usr/bin/env python3
import json
import os
import sys

data = json.load(sys.stdin)
file_path = data.get("tool_input", {}).get("file_path", "")
fix_mode = os.path.exists(".claude/fix-mode")
is_test = (
    file_path.startswith("tests/")
    or "/tests/" in file_path
    or os.path.basename(file_path).startswith("test_")
)
if fix_mode and is_test:
    print(
        "Les fichiers de tests sont protégés pendant une correction. "
        "Corrige le code, pas le test.",
        file=sys.stderr,
    )
    sys.exit(2)
sys.exit(0)
