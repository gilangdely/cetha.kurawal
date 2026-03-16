import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";
import { sanitizePdfText } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    color: "#111827",
    lineHeight: 1.3,
  },

  // ─── SIDEBAR ─────────────────────────────────────────────────────────
  sidebar: {
    width: "32%",
    backgroundColor: "#1e3a5f",
    padding: "28pt 20pt",
    flexShrink: 0,
  },

  // Photo
  photoContainer: {
    alignItems: "center",
    marginBottom: "24pt",
  },
  photo: {
    width: "76pt",
    height: "76pt",
    borderRadius: "38pt",
    borderWidth: "2.5pt",
    borderColor: "#ffffff",
    borderStyle: "solid",
  },
  photoPlaceholder: {
    width: "76pt",
    height: "76pt",
    borderRadius: "38pt",
    backgroundColor: "#2d4f7a",
  },

  // Name block (inside sidebar when no main header is used)
  sidebarName: {
    fontSize: "14pt",
    fontWeight: 800,
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: "3pt",
    lineHeight: 1.2,
  },
  sidebarJobTitle: {
    fontSize: "7.5pt",
    fontWeight: 600,
    color: "#93c5fd",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "1.4pt",
    marginBottom: "22pt",
  },

  // Sidebar section label
  sidebarSectionTitle: {
    fontSize: "6.5pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.8pt",
    color: "#64748b",
    marginBottom: "8pt",
    marginTop: "18pt",
  },
  sidebarDivider: {
    height: "0.5pt",
    backgroundColor: "#2d4f7a",
    marginBottom: "10pt",
  },

  // Contact
  contactItem: {
    fontSize: "8pt",
    color: "#cbd5e1",
    fontWeight: 400,
    marginBottom: "5pt",
    lineHeight: 1.4,
  },

  // Skills
  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "5pt",
  },
  skillBadge: {
    backgroundColor: "#2d4f7a",
    paddingHorizontal: "8pt",
    paddingVertical: "3pt",
    borderRadius: "3pt",
    fontSize: "7.5pt",
    fontWeight: 600,
    color: "#93c5fd",
  },

  // ─── MAIN ─────────────────────────────────────────────────────────────
  main: {
    flex: 1,
    padding: "32pt 28pt 32pt 24pt",
    backgroundColor: "#ffffff",
  },

  // Main header
  mainHeader: {
    marginBottom: "22pt",
    paddingBottom: "16pt",
    borderBottomWidth: "1pt",
    borderBottomColor: "#e2e8f0",
    borderBottomStyle: "solid",
  },
  name: {
    fontSize: "22pt",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.3pt",
    marginBottom: "3pt",
  },
  jobTitle: {
    fontSize: "10pt",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1.6pt",
  },

  // Section
  section: {
    marginBottom: "18pt",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "10pt",
    gap: "8pt",
  },
  sectionBar: {
    width: "16pt",
    height: "3pt",
    borderRadius: "2pt",
  },
  sectionTitle: {
    fontSize: "8.5pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.4pt",
    color: "#0f172a",
  },
  sectionRule: {
    flex: 1,
    height: "0.5pt",
    backgroundColor: "#e2e8f0",
  },

  // Summary
  summary: {
    fontSize: "9.5pt",
    lineHeight: 1.65,
    color: "#475569",
  },

  // Experience / Education item
  // Hapus semua border dari styles.item
  item: {
    marginBottom: "12pt",
    flexDirection: "row",  // ubah ke row
  },
  itemBorder: {
    width: "1.5pt",
    backgroundColor: "#e2e8f0",
    marginRight: "10pt",
    borderRadius: "1pt",
  },
  itemContent: {
    flex: 1,
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "1pt",
  },
  itemTitle: {
    fontSize: "10pt",
    fontWeight: 700,
    color: "#0f172a",
    flex: 1,
    paddingRight: "8pt",
  },
  itemDate: {
    fontSize: "7.5pt",
    color: "#94a3b8",
    fontWeight: 500,
    flexShrink: 0,
  },
  itemSubtitle: {
    fontSize: "8.5pt",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "4pt",
  },

  // Bullet description
  bulletRow: {
    flexDirection: "row",
    gap: "5pt",
    marginBottom: "2pt",
  },
  bulletDash: {
    fontSize: "9pt",
    color: "#94a3b8",
    lineHeight: 1.55,
  },
  bulletText: {
    flex: 1,
    fontSize: "8.5pt",
    lineHeight: 1.55,
    color: "#475569",
  },
  plainDescription: {
    fontSize: "8.5pt",
    lineHeight: 1.55,
    color: "#475569",
  },
});

// Bullet description renderer
const Description = ({ text }: { text: string }) => {
  const lines = sanitizePdfText(text)
    .split("\n")
    .map((l) => l.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return <Text style={styles.plainDescription}>{sanitizePdfText(text)}</Text>;
  }

  return (
    <View>
      {lines.map((line, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletDash}>–</Text>
          <Text style={styles.bulletText}>{line}</Text>
        </View>
      ))}
    </View>
  );
};

export const CreativeModernPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor: string = style?.fontColor || "#2563eb";
  const hasPhoto = data.personalInfo.showPhoto && data.personalInfo.photoUrl;

  return (
    <Page size="A4" style={styles.page}>

      {/* ═══ SIDEBAR ══════════════════════════════════════════════════ */}
      <View style={styles.sidebar}>

        {/* Photo */}
        <View style={styles.photoContainer}>
          {hasPhoto ? (
            <Image src={data.personalInfo.photoUrl!} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder} />
          )}
        </View>

        {/* Name + Title */}
        <Text style={styles.sidebarName}>
          {data.personalInfo.fullName || "Nama Lengkap"}
        </Text>
        {data.personalInfo.jobTitle && (
          <Text style={[styles.sidebarJobTitle, { color: primaryColor === "#2563eb" ? "#93c5fd" : primaryColor }]}>
            {data.personalInfo.jobTitle}
          </Text>
        )}

        {/* Contact */}
        {(data.personalInfo.email || data.personalInfo.phone || data.personalInfo.location || data.personalInfo.linkedin || data.personalInfo.portfolio) && (
          <View>
            <Text style={styles.sidebarSectionTitle}>Kontak</Text>
            <View style={styles.sidebarDivider} />
            {data.personalInfo.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
            {data.personalInfo.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
            {data.personalInfo.location && <Text style={styles.contactItem}>{data.personalInfo.location}</Text>}
            {data.personalInfo.linkedin && <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>}
            {data.personalInfo.portfolio && <Text style={styles.contactItem}>{data.personalInfo.portfolio}</Text>}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View>
            <Text style={styles.sidebarSectionTitle}>Keahlian</Text>
            <View style={styles.sidebarDivider} />
            <View style={styles.skillWrap}>
              {data.skills.map((skill) => (
                <Text key={skill.id} style={styles.skillBadge}>{skill.name}</Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* ═══ MAIN ═════════════════════════════════════════════════════ */}
      <View style={styles.main}>

        {/* Summary */}
        {data.personalInfo.summary && (
          <View style={styles.section} wrap={false}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionBar, { backgroundColor: primaryColor }]} />
              <Text style={styles.sectionTitle}>Profil</Text>
              <View style={styles.sectionRule} />
            </View>
            <Text style={styles.summary}>{sanitizePdfText(data.personalInfo.summary)}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionBar, { backgroundColor: primaryColor }]} />
              <Text style={styles.sectionTitle}>Pengalaman</Text>
              <View style={styles.sectionRule} />
            </View>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.item} wrap={false}>
                {/* Ganti borderLeft dengan View solid */}
                <View style={styles.itemBorder} />

                <View style={styles.itemContent}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemTitle}>{exp.role}</Text>
                    <Text style={styles.itemDate}>{exp.startDate} – {exp.endDate || "Sekarang"}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>
                    {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                  </Text>
                  {exp.description && <Description text={exp.description} />}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionBar, { backgroundColor: primaryColor }]} />
              <Text style={styles.sectionTitle}>Pendidikan</Text>
              <View style={styles.sectionRule} />
            </View>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.item} wrap={false}>
                <View style={[styles.itemBorder, { backgroundColor: primaryColor + "40" }]} />

                <View style={styles.itemContent}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemTitle}>
                      {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                    </Text>
                    <Text style={styles.itemDate}>{edu.startDate} – {edu.endDate || "Sekarang"}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                  {edu.description && <Description text={edu.description} />}
                </View>
              </View>
            ))}
          </View>
        )}

      </View>
    </Page>
  );
};