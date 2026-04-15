#!/usr/bin/env bash
# Batch convert all HTML guides + sales copy to PDF using Chrome headless.
# Run from project root: bash tools/html-to-pdf.sh

set -u

CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
if [ ! -f "$CHROME" ]; then
  echo "Chrome not found at $CHROME" >&2
  exit 1
fi

# Absolute project root (convert bash path to Windows-style for chrome)
root_bash="$(pwd)"
# Convert /c/Users/... to c:/Users/...
root_win=$(echo "$root_bash" | sed -E 's|^/([a-zA-Z])/|\1:/|')

total=0
success=0
failed=0
fail_log="$root_bash/pdf-errors.log"
: > "$fail_log"

while IFS= read -r html; do
  total=$((total+1))
  pdf="${html%.html}.pdf"
  # Windows-style absolute paths for Chrome
  html_win="$root_win/${html#./}"
  pdf_win="$root_win/${pdf#./}"
  url="file:///$html_win"

  if "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --virtual-time-budget=5000 --print-to-pdf="$pdf_win" "$url" >/dev/null 2>&1; then
    if [ -f "$pdf" ] && [ -s "$pdf" ]; then
      success=$((success+1))
      echo "[$success/$total] $(basename "$html") → $(basename "$pdf")"
    else
      failed=$((failed+1))
      echo "FAILED (empty output): $html" >> "$fail_log"
    fi
  else
    failed=$((failed+1))
    echo "FAILED (chrome error): $html" >> "$fail_log"
  fi
done < <(find products -type f \( -path "*/delivery/*.html" -o -path "*/copy/*.html" \))

echo ""
echo "=== Summary ==="
echo "Total:    $total"
echo "Success:  $success"
echo "Failed:   $failed"
if [ $failed -gt 0 ]; then
  echo "See $fail_log"
fi
