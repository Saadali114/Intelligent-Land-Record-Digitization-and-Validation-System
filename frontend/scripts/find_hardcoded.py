import os
import re

files_to_check = []
for base in [
    'frontend/app/portal',
    'frontend/app/citizen',
    'frontend/components/portal',
    'frontend/components/citizen-verification'
]:
    for root, _, files in os.walk(base):
        for f in files:
            if f.endswith('.tsx'):
                files_to_check.append(os.path.join(root, f))

# regex for JSX text: >something< where something has English letters
jsx_text_pattern = re.compile(r'>\s*([A-Za-z][A-Za-z0-9 ,/.:;\'"?!()&—–•-]+)\s*<')

for fpath in sorted(files_to_check):
    with open(fpath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    file_findings = []
    for line_num, line in enumerate(lines, 1):
        # Ignore comments or imports
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
            continue
        if 'import ' in stripped:
            continue

        matches = jsx_text_pattern.findall(line)
        for m in matches:
            m_clean = m.strip()
            # filter out simple code-like or icon-like words or numbers
            if m_clean in ['ILRDVS', 'PDF', 'PNG', 'JPG', 'JPEG', 'TIFF', 'DPI', 'SHA-256', 'UIDAI', 'GIS', 'OCR', 'ULPIN', 'MB', 'Ha', '142/3', '145/2A', '841920', 'Pune', 'Haveli', 'Khadakwasla', 'Nashik', 'Dindori']:
                continue
            if len(m_clean) > 2 and not m_clean.startswith('{') and not m_clean.endswith('}'):
                file_findings.append((line_num, m_clean))

        # Also check placeholders, titles, aria-labels
        attr_matches = re.findall(r'(placeholder|title|aria-label)=["\']([^"\']*[A-Za-z ]{3,}[^"\']*)["\']', line)
        for attr, val in attr_matches:
            if not val.startswith('{'):
                file_findings.append((line_num, f'[{attr}] {val}'))

    if file_findings:
        print(f"\n--- {fpath} ({len(file_findings)} items) ---")
        for lnum, text in file_findings[:25]:
            print(f"  L{lnum}: {text}")
        if len(file_findings) > 25:
            print(f"  ... and {len(file_findings) - 25} more")
