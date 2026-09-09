import json

for lang in ['en', 'mr', 'hi']:
    with open(f'frontend/locales/{lang}/translation.json', 'r', encoding='utf-8') as f:
        text = f.read()
        vw = text.count('"verificationWorkflow":')
        cv = text.count('"citizenVerifications":')
        up = text.count('"upload":')
        d = json.loads(text)
        upload_keys = [
            'fileFormatNote', 'confirmFileDesc', 'stateLabel',
            'averageConfidence', 'reviewDiscrepanciesDesc',
            'demoOtpNote', 'docTypeLabel'
        ]
        missing = [k for k in upload_keys if k not in d['upload']]
        print(f"{lang} -> verificationWorkflow count: {vw}, citizenVerifications count: {cv}, upload count: {up}, missing 7 keys: {len(missing)}")
