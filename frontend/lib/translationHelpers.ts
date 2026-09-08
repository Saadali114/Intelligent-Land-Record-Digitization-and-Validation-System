export function formatRole(
  role?: string | null,
  t?: (key: string, options?: any) => string
): string {
  if (!role) return '';
  const r = role.toLowerCase();
  if (t) {
    return t(`roles.${r}`, {
      defaultValue: t(`status.${r}`, {
        defaultValue: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
      }),
    });
  }
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export function formatStatus(
  status?: string | null,
  t?: (key: string, options?: any) => string
): string {
  if (!status) return '';
  const s = status.toLowerCase();
  const readable = status.replace(/_/g, ' ');
  if (t) {
    return t(`status.${s}`, {
      defaultValue: readable.charAt(0).toUpperCase() + readable.slice(1),
    });
  }
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

export function formatDocType(
  docType?: string | null,
  t?: (key: string, options?: any) => string
): string {
  if (!docType) return '';
  const dt = docType.toLowerCase().replace(/[\s\/-]+/g, '_');
  let key = dt;
  if (dt.includes('7_12') || dt.includes('712')) key = 'doc_7_12';
  else if (dt.includes('8a') || dt.includes('8_a')) key = 'doc_8a';
  else if (dt.includes('ferfar') || dt.includes('mutation')) key = 'ferfar';
  else if (dt.includes('sale') || dt.includes('deed')) key = 'sale_deed';

  if (t) {
    return t(`documentTypes.${key}`, {
      defaultValue: docType,
    });
  }
  return docType;
}

export function formatDistrict(
  district?: string | null,
  t?: (key: string, options?: any) => string
): string {
  if (!district) return '';
  const d = district.toLowerCase().trim();
  if (t) {
    return t(`districts.${d}`, {
      defaultValue: district,
    });
  }
  return district;
}
