import json
import re
import os

def load_json(p):
    with open(p, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_keys(d, prefix=''):
    keys = set()
    for k, v in d.items():
        full = f"{prefix}.{k}" if prefix else k
        keys.add(full)
        if isinstance(v, dict):
            keys.update(get_keys(v, full))
    return keys

en = load_json('frontend/locales/en/translation.json')
mr = load_json('frontend/locales/mr/translation.json')
hi = load_json('frontend/locales/hi/translation.json')

en_keys = get_keys(en)
mr_keys = get_keys(mr)
hi_keys = get_keys(hi)

print(f"en keys: {len(en_keys)}, mr keys: {len(mr_keys)}, hi keys: {len(hi_keys)}")
print(f"Keys in en but not mr: {len(en_keys - mr_keys)}")
print(f"Keys in en but not hi: {len(en_keys - hi_keys)}")

target_dirs = [
    'frontend/app/portal',
    'frontend/app/citizen',
    'frontend/components/portal',
    'frontend/components/citizen-verification'
]

pattern = re.compile(r"\bt\(\s*['\"]([^'\"]+)['\"]")

missing_in_en = []
all_found = set()

for d in target_dirs:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                matches = pattern.findall(content)
                for m in matches:
                    all_found.add(m)
                    if m not in en_keys:
                        missing_in_en.append((m, path))

print('\nMissing in en/translation.json:')
for k, p in sorted(missing_in_en):
    print(f"  {k} in {p}")
