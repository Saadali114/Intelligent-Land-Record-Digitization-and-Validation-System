import json
import subprocess

# 1. Load Git show for old verificationWorkflow
old_en = json.loads(subprocess.check_output(['git', 'show', '7b68a6a:frontend/locales/en/translation.json'], encoding='utf-8'))
old_mr = json.loads(subprocess.check_output(['git', 'show', '7b68a6a:frontend/locales/mr/translation.json'], encoding='utf-8'))

# 2. Load current files
with open('frontend/locales/en/translation.json', 'r', encoding='utf-8') as f:
    en = json.load(f)
with open('frontend/locales/mr/translation.json', 'r', encoding='utf-8') as f:
    mr = json.load(f)
with open('frontend/locales/hi/translation.json', 'r', encoding='utf-8') as f:
    hi = json.load(f)

# 3. Restore lost keys to EN and MR verificationWorkflow
merged_en_vw = dict(old_en['verificationWorkflow'])
merged_en_vw.update(en['verificationWorkflow'])
en['verificationWorkflow'] = merged_en_vw

merged_mr_vw = dict(old_mr['verificationWorkflow'])
merged_mr_vw.update(mr['verificationWorkflow'])
mr['verificationWorkflow'] = merged_mr_vw

# 4. Hindi translations for the 36 new verificationWorkflow keys
hi_new_vw = {
  "accountStatusValue": "पंजीकृत नागरिक खाता • ईमेल सत्यापन सक्रिय",
  "actionRequiredRelationship": "कार्रवाई आवश्यक: कानूनी संबंध स्थापित नहीं",
  "appProcessedDesc": "अधिकारी समीक्षा कंसोल में वैधानिक सत्यापन के लिए डोजियर तैयार है।",
  "appProcessedTitle": "आवेदन सफलतापूर्वक संसाधित हुआ",
  "calculatedRiskIndex": "गणना किया गया जोखिम सूचकांक",
  "case1Subtitle": "शंकर पाटिल • खसरा/सर्वे 145/2A • क्षेत्रफल 1.25 हे. • मेल खाता स्वामी",
  "case2Subtitle": "आवेदक: राहुल पाटिल • दस्तावेज़: शंकर पाटिल • वास्तविक 7/12 • असत्यापित स्थिति",
  "case3Subtitle": "निकाला गया क्षेत्रफल 2.50 हे. बनाम भूकर रिकॉर्ड 1.25 हे. • परिवर्तित खसरा 145/9X",
  "identityVerifiedDesc": "{{name}} ({{email}}) के लिए 6-अंकीय कोड द्वारा ईमेल इनबॉक्स नियंत्रण सत्यापित।",
  "noPositiveSignals": "कोई सकारात्मक संकेत सत्यापित नहीं हुआ।",
  "officerWorkspace": "अधिकारी कार्यक्षेत्र",
  "openOfficerWorkspace": "अधिकारी कार्यक्षेत्र खोलें",
  "pageDesc": "4-स्तंभ सत्यापन: पहचान, दस्तावेज़ संगति, भूकर मिलान और कानूनी संबंध",
  "pageTitle": "स्वचालित भूमि रिकॉर्ड सत्यापन",
  "presetCasesSubtitle": "स्वचालित बहु-कारक जोखिम पहचान देखने के लिए परीक्षण मामले बदलें",
  "registeredOwnerDesc": "प्रपत्र 7/12 भूकर रजिस्टर में दर्ज शीर्षक धारक",
  "relationshipNotEstablished": "संबंध स्थापित नहीं हुआ",
  "requiredDoc1": "{{owner}} से पंजीकृत मुख्तारनामा (पावर ऑफ अटॉर्नी)",
  "requiredDoc2": "पटवारी/तहसीलदार द्वारा जारी कानूनी उत्तराधिकार प्रमाणपत्र",
  "requiredDoc3": "पंजीकृत पट्टा / किरायेदारी समझौता",
  "requiredDocuments": "समाधान के लिए आवश्यक कानूनी दस्तावेज़:",
  "resetFlow": "प्रक्रिया रीसेट करें",
  "riskAnalysisDesc": "पहचान, दस्तावेज़, रजिस्ट्री और कानूनी स्थिति में निर्धारित समग्र स्कोरिंग",
  "sendOtpPrompt": "पंजीकृत ईमेल पर वास्तविक 6-अंकीय सत्यापन कोड भेजने के लिए नीचे क्लिक करें",
  "sendingOtp": "ईमेल ओटीपी भेजा जा रहा है...",
  "standingConfirmed": "कानूनी स्थिति की पुष्टि हुई",
  "statutoryComplianceActive": "वैधानिक अनुपालन मोड सक्रिय",
  "step1Identity": "1. पहचान",
  "step2Upload": "2. दस्तावेज़ अपलोड",
  "step3Pipeline": "3. एआई पाइपलाइन",
  "step4Dossier": "4. 4-स्तंभ डोजियर",
  "systemNote": "सिस्टम नोट:",
  "testAnotherCase": "दूसरा मामला परखें",
  "trackingLabel": "ट्रैकिंग",
  "verifiedApplicantDesc": "स्तंभ 1 में पंजीकृत मोबाइल ओटीपी द्वारा प्रमाणित",
  "zeroNegativeSignals": "शून्य नकारात्मक जोखिम संकेतक मिले"
}

merged_hi_vw = dict(hi['verificationWorkflow'])
merged_hi_vw.update(hi_new_vw)
hi['verificationWorkflow'] = merged_hi_vw

# 5. Hindi citizenVerifications
hi['citizenVerifications'] = {
  "selfServiceBadge": "नागरिक स्वयं-सेवा पोर्टल",
  "mlrcSection": "धारा 149 एमएलआरसी",
  "pageTitle": "भूमि दस्तावेज़ सत्यापन",
  "pageDesc": "अपने डिजीटल भूमि शीर्षकों की प्रगति, एआई सत्यापन मेट्रिक्स और उप-विभागीय अधिकारी के निर्णयों को ट्रैक करें।",
  "uploadNewDoc": "नया दस्तावेज़ अपलोड करें",
  "actionRequiredTitle": "कार्रवाई आवश्यक: अधिकारी ने स्पष्टीकरण मांगा है",
  "actionRequiredDesc": "राजस्व अधिकारी ने {{count}} आवेदन(नों) के लिए अतिरिक्त दस्तावेज़ या स्पष्टीकरण का अनुरोध किया है। कृपया तुरंत समीक्षा करें और अपना उत्तर सबमिट करें।",
  "respondNow": "अभी उत्तर दें →",
  "searchPlaceholder": "ट्रैकिंग आईडी, दस्तावेज़ प्रकार, या खसरा नंबर द्वारा खोजें...",
  "loadingApplications": "आवेदन लोड हो रहे हैं...",
  "noApplicationsFound": "कोई सत्यापन आवेदन नहीं मिला",
  "noApplicationsDesc": "स्वचालित सत्यापन शुरू करने के लिए भूमि दस्तावेज़ अपलोड करें।",
  "uploadNow": "दस्तावेज़ अभी अपलोड करें",
  "colTrackingNumber": "ट्रैकिंग नंबर",
  "colDocumentType": "दस्तावेज़ प्रकार",
  "colSurveyVillage": "खसरा व गाँव",
  "colAiIntegrity": "एआई अखंडता जाँच",
  "colOfficerStatus": "अधिकारी स्थिति",
  "colDetails": "विवरण",
  "statusStatutoryVerified": "वैधानिक सत्यापित",
  "statusRejected": "अस्वीकृत",
  "statusClarificationNeeded": "स्पष्टीकरण आवश्यक",
  "statusUnderReview": "अधिकारी समीक्षाधीन",
  "respondBtn": "उत्तर दें",
  "viewStatusBtn": "स्थिति देखें",
  "riskLabel": "जोखिम",
  "verificationDetail": {
    "loadingDetails": "सत्यापन विवरण लोड हो रहा है...",
    "appNotFound": "आवेदन नहीं मिला",
    "backToVerifications": "मेरे आवेदनों पर वापस जाएं",
    "backToList": "सत्यापन सूची पर वापस जाएं",
    "pageTitle": "आवेदन ट्रैकिंग डोजियर",
    "submitted": "प्रस्तुत किया गया",
    "surveyNo": "खसरा / सर्वे सं.",
    "statusStatutoryVerified": "वैधानिक सत्यापित",
    "statusRejected": "सत्यापन अस्वीकृत",
    "statusClarificationRequested": "कार्रवाई आवश्यक: स्पष्टीकरण मांगा गया",
    "statusPendingOfficer": "उप-विभागीय अधिकारी समीक्षा लंबित",
    "officerClarificationTitle": "अधिकारी स्पष्टीकरण सूचना",
    "officerClarificationDesc": "राजस्व अधिकारी ने आपके दस्तावेज़ की समीक्षा की और निम्नलिखित निर्देश दिए:",
    "clarificationReplySuccess": "आपका स्पष्टीकरण उप-विभागीय अधिकारी को प्रस्तुत कर दिया गया है। आवेदन स्थिति सक्रिय समीक्षा में वापस आ गई है।",
    "clarificationLabel": "आपका स्पष्टीकरण विवरण / दस्तावेज़ संदर्भ:",
    "clarificationPlaceholder": "संबंध, उत्तराधिकार क्रम स्पष्ट करें, या संदर्भ संख्या संलग्न करें...",
    "submitting": "प्रस्तुत किया जा रहा है...",
    "submitClarification": "अधिकारी को स्पष्टीकरण प्रस्तुत करें",
    "extractedEntities": "निकाले गए विवरण",
    "ownerName": "स्वामी का नाम",
    "surveyGatNo": "खसरा / गट सं.",
    "landArea": "भूमि क्षेत्रफल",
    "ocrMetric": "ओसीआर इंजन मेट्रिक",
    "ocrConfidence": "{{percent}}% विश्वसनीयता",
    "cadastralCrossCheck": "भूकर मिलान जाँच",
    "referenceMatch": "संदर्भ मिलान",
    "officialRecordId": "आधिकारिक रिकॉर्ड आईडी",
    "titleRelationship": "शीर्षक संबंध",
    "cadastralMatchSummary": "राज्य प्रोटोटाइप भूकर डेटाबेस से मिलान किया गया।",
    "integrityEvaluation": "अखंडता मूल्यांकन",
    "discrepancyRisk": "विसंगति जोखिम",
    "visualDensity": "दृश्य घनत्व",
    "visualDensityValue": "अखंड / कोई फेरबदल नहीं",
    "consistencyChecks": "संगति जाँच",
    "consistencyChecksValue": "6 में से 6 उत्तीर्ण",
    "auditTimeline": "वैधानिक ऑडिट समयरेखा"
  }
}

# 6. Common keys
en['common']['citizen'] = "Citizen"
mr['common']['citizen'] = "नागरिक"
hi['common']['citizen'] = "नागरिक"

# 7. Upload namespace keys
# Ensure 7 new keys + aiStage1..5 + sizeLabel, typeLabel + landArea, landType, district, taluka, village exist in all 3
en_extra_upload = {
  "landArea": "Land Area",
  "landType": "Land Type",
  "district": "District",
  "taluka": "Taluka",
  "village": "Village"
}
mr_extra_upload = {
  "landArea": "जमीन क्षेत्रफळ",
  "landType": "जमीन प्रकार",
  "district": "जिल्हा",
  "taluka": "तालुका",
  "village": "गाव"
}
hi_extra_upload = {
  "fileFormatNote": "स्पष्ट स्कैन की गई प्रतियां या फोटो अपलोड करें। समर्थित प्रारूप: PDF, PNG, JPG (15 MB तक)।",
  "confirmFileDesc": "स्वचालित एआई डिजिटलीकरण शुरू करने से पहले अपनी अपलोड की गई फ़ाइल के विवरण की पुष्टि करें।",
  "stateLabel": "राज्य",
  "averageConfidence": "औसत विश्वसनीयता",
  "reviewDiscrepanciesDesc": "पाई गई किसी भी विसंगति की समीक्षा करें और संशोधित करें।",
  "demoOtpNote": "डेमो ओटीपी स्वचालित रूप से भरा गया:",
  "docTypeLabel": "दस्तावेज़ प्रकार:",
  "aiStage1": "दस्तावेज़ प्रीप्रोसेसिंग और तिरछापन सुधार",
  "aiStage2": "बहुभाषी ओसीआर (देवनागरी हिंदी/मराठी और अंग्रेजी)",
  "aiStage3": "इकाई और भूकर निष्कर्षण (सर्वे, खाता, क्षेत्रफल)",
  "aiStage4": "भूकर मानचित्र ज्यामिति के साथ मिलान",
  "aiStage5": "विसंगति और अंतर मूल्यांकन",
  "sizeLabel": "आकार",
  "typeLabel": "प्रकार",
  "landArea": "भूमि क्षेत्रफल",
  "landType": "भूमि प्रकार",
  "district": "ज़िला",
  "taluka": "तालुका / तहसील",
  "village": "गाँव"
}

en['upload'].update(en_extra_upload)
mr['upload'].update(mr_extra_upload)
hi['upload'].update(hi_extra_upload)

# 8. Save updated dictionaries with utf-8 and clean 2-space indentation
with open('frontend/locales/en/translation.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
    f.write('\n')

with open('frontend/locales/mr/translation.json', 'w', encoding='utf-8') as f:
    json.dump(mr, f, ensure_ascii=False, indent=2)
    f.write('\n')

with open('frontend/locales/hi/translation.json', 'w', encoding='utf-8') as f:
    json.dump(hi, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("All 3 translation dictionaries updated successfully.")
