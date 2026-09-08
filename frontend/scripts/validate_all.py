import json

def check_duplicates(path):
    def dict_raise_on_duplicates(ordered_pairs):
        d = {}
        for k, v in ordered_pairs:
            if k in d:
                raise ValueError(f'Duplicate key found in {path}: {k}')
            d[k] = v
        return d
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f, object_pairs_hook=dict_raise_on_duplicates)

print('--- VALIDATING JSON FILES & DUPLICATES ---')
en = check_duplicates('frontend/locales/en/translation.json')
mr = check_duplicates('frontend/locales/mr/translation.json')
hi = check_duplicates('frontend/locales/hi/translation.json')
print('All 3 JSON files parsed successfully with ZERO duplicates!')

def get_keys(d, prefix=''):
    keys = set()
    for k, v in d.items():
        full = f'{prefix}.{k}' if prefix else k
        keys.add(full)
        if isinstance(v, dict):
            keys.update(get_keys(v, full))
    return keys

en_keys = get_keys(en)
mr_keys = get_keys(mr)
hi_keys = get_keys(hi)

print('\n--- CHECKING PARITY ---')
print(f'en keys: {len(en_keys)}')
print(f'mr keys: {len(mr_keys)}')
print(f'hi keys: {len(hi_keys)}')

diff_en_mr = en_keys ^ mr_keys
diff_en_hi = en_keys ^ hi_keys

print(f'Diff EN vs MR count: {len(diff_en_mr)}')
print(f'Diff EN vs HI count: {len(diff_en_hi)}')

print('\n--- CHECKING NAMESPACE OCCURRENCES ---')
for lang in ['en', 'mr', 'hi']:
    with open(f'frontend/locales/{lang}/translation.json', 'r', encoding='utf-8') as f:
        text = f.read()
    vw = text.count('"verificationWorkflow":')
    cv = text.count('"citizenVerifications":')
    up = text.count('"upload":')
    print(f'{lang}: verificationWorkflow={vw}, citizenVerifications={cv}, upload={up}')

print('\n--- CHECKING 7 NEW UPLOAD KEYS ---')
upload_keys = [
    'fileFormatNote', 'confirmFileDesc', 'stateLabel',
    'averageConfidence', 'reviewDiscrepanciesDesc',
    'demoOtpNote', 'docTypeLabel'
]
for lang, d in [('EN', en), ('MR', mr), ('HI', hi)]:
    missing = [k for k in upload_keys if k not in d.get('upload', {})]
    print(f'{lang} missing 7 upload keys: {missing}')
