import { Page, Text, View, StyleSheet, Image as PdfImage } from "@react-pdf/renderer";

import { ResumeData } from "@/types/build-cv";
import { sanitizePdfText } from "@/lib/utils";

const AMBER = "#f59e0b";
const AMBER_LIGHT = "#fcd34d";

const styles = StyleSheet.create({
  page: {
    padding: "20pt 24pt 22pt",
    backgroundColor: "#fafaf8",
    fontFamily: "Manrope",
    color: "#1c1917",
    lineHeight: 1.3,
    position: "relative",
  },

  // ─── TOP ACCENT BAR ───────────────────────────────────────────────────
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3pt",
    backgroundColor: AMBER,
  },

  // ─── HEADER ──────────────────────────────────────────────────────────
  header: {
    alignItems: "center",
    marginBottom: "12pt",
    paddingBottom: "10pt",
    borderBottomWidth: "0.75pt",
    borderBottomColor: "#e7e2da",
    borderBottomStyle: "solid",
  },
  eyebrow: {
    fontSize: "7pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "4pt",
    color: "#b45309",
    marginBottom: "10pt",
  },
  photo: {
    width: "56pt",
    height: "56pt",
    borderRadius: "28pt",
    borderWidth: "2pt",
    borderColor: "#fde68a",
    borderStyle: "solid",
    marginBottom: "10pt",
  },
  name: {
    fontSize: "24pt",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "2.5pt",
    color: "#1c1917",
    marginBottom: "5pt",
    textAlign: "center",
  },
  jobTitle: {
    fontSize: "9pt",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "2.5pt",
    color: AMBER,
    marginBottom: "10pt",
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "4pt",
  },
  contactItem: {
    fontSize: "8.5pt",
    fontWeight: 500,
    color: "#78716c",
  },
  contactSep: {
    fontSize: "8.5pt",
    color: "#d5cfc5",
  },

  // ─── SUMMARY ─────────────────────────────────────────────────────────
  summarySection: {
    alignItems: "center",
    marginBottom: "12pt",
  },
  summaryText: {
    fontSize: "9.5pt",
    fontWeight: 300,       // light weight sebagai pengganti
    lineHeight: 1.8,
    color: "#78716c",
    textAlign: "center",
  },



  // ─── SECTION DIVIDER (centered) ──────────────────────────────────────
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "16pt",
    gap: "10pt",
  },
  sectionRule: {
    flex: 1,
    height: "0.75pt",
    backgroundColor: "#e7e2da",
  },
  sectionLabel: {
    fontSize: "8pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2.5pt",
    color: AMBER,
  },

  // ─── SECTION DIVIDER LEFT (for bottom grid) ──────────────────────────
  sectionDividerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "14pt",
    gap: "10pt",
  },
  sectionLabelLeft: {
    fontSize: "8pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2.5pt",
    color: AMBER,
  },
  sectionRuleLeft: {
    flex: 1,
    height: "0.75pt",
    backgroundColor: "#e7e2da",
  },

  // ─── EXPERIENCE SECTION ──────────────────────────────────────────────
  experienceSection: {
    marginBottom: "20pt",
  },
  expItem: {
    marginBottom: "16pt",
    paddingBottom: "16pt",
    borderBottomWidth: "0.5pt",
    borderBottomColor: "#f0ece4",
    borderBottomStyle: "solid",
  },
  expItemLast: {
    marginBottom: "0pt",
    paddingBottom: "0pt",
    borderBottomWidth: 0,
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "3pt",
  },
  itemTitle: {
    fontSize: "11pt",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.6pt",
    color: "#1c1917",
    flex: 1,
    paddingRight: "8pt",
  },
  itemDate: {
    fontSize: "8.5pt",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5pt",
    color: "#a8a29e",
    flexShrink: 0,
  },
  itemSubtitle: {
    fontSize: "9pt",
    fontWeight: 700,
    color: AMBER,
    marginBottom: "6pt",
  },
  itemLocation: {
    fontSize: "9pt",
    fontWeight: 400,
    color: "#a8a29e",
  },

  // ─── BULLET DESCRIPTION ──────────────────────────────────────────────
  bulletRow: {
    flexDirection: "row",
    gap: "5pt",
    marginBottom: "2pt",
  },
  bulletDiamond: {
    fontSize: "9pt",
    color: AMBER,
    marginTop: "0pt",
  },

  bulletText: {
    flex: 1,
    fontSize: "9pt",
    lineHeight: 1.6,
    color: "#57534e",
  },
  plainDescription: {
    fontSize: "9pt",
    lineHeight: 1.6,
    color: "#57534e",
  },

  // ─── BOTTOM GRID ─────────────────────────────────────────────────────
  bottomGrid: {
    flexDirection: "column",
    gap: "16pt",
    marginTop: "4pt",
  },
  bottomCol: {
  },

  // ─── EDUCATION ───────────────────────────────────────────────────────
  eduItem: {
    marginBottom: "10pt",
  },
  eduDegree: {
    fontSize: "10pt",
    fontWeight: 700,
    color: "#1c1917",
    lineHeight: 1.3,
    marginBottom: "1pt",
  },
  eduField: {
    fontSize: "9pt",
    fontWeight: 400,
    color: "#78716c",
    marginBottom: "3pt",
  },
  eduInstitution: {
    fontSize: "9pt",
    fontWeight: 600,
    color: "#78716c",
    marginBottom: "1pt",
  },
  eduDate: {
    fontSize: "8pt",
    color: "#a8a29e",
    fontWeight: 400,
  },
  eduDescription: {
    marginTop: "4pt",
    fontSize: "8.5pt",
    lineHeight: 1.5,
    color: "#a8a29e",
  },

  // ─── SKILLS ──────────────────────────────────────────────────────────
  skillItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: "6pt",
    marginBottom: "6pt",
  },
  skillDiamond: {
    fontSize: "9pt",
    color: AMBER_LIGHT,
  },
  skillName: {
    fontSize: "10pt",
    fontWeight: 500,
    color: "#57534e",
  },

  // ─── BOTTOM ACCENT BAR ───────────────────────────────────────────────
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: "80pt",
    right: "80pt",
    height: "1.5pt",
    backgroundColor: AMBER,
    opacity: 0.4,
  },
});

// Description: multi-line → diamond bullets, single → plain
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
          <Text style={styles.bulletDiamond}>•</Text>
          <Text style={styles.bulletText}>{line}</Text>
        </View>
      ))}
    </View>
  );
};

// Contact items with | separator
const ContactItems = ({ items }: { items: string[] }) => {
  const filtered = items.filter(Boolean);
  return (
    <View style={styles.contactRow}>
      {filtered.map((item, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
          {i > 0 && <Text style={[styles.contactSep, { marginRight: "4pt" }]}>|</Text>}
          <Text style={styles.contactItem}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export const ExecutiveMinimalistPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const hasPhoto = data.personalInfo.showPhoto && data.personalInfo.photoUrl;

  const contactItems = [
    data.personalInfo.location,
    data.personalInfo.phone,
    data.personalInfo.email,
    data.personalInfo.linkedin,
  ].filter(Boolean) as string[];

  return (
    <Page size="A4" style={styles.page}>

      {/* ═══ HEADER */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Curriculum Vitae</Text>

        {hasPhoto && (
          <PdfImage src={data.personalInfo.photoUrl!} style={styles.photo} />
        )}

        <Text style={styles.name}>{data.personalInfo.fullName || "Nama Lengkap"}</Text>

        {data.personalInfo.jobTitle && (
          <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text>
        )}

        <ContactItems items={contactItems} />
      </View>

      {/* ═══ SUMMARY */}
      {data.personalInfo.summary && (
        <View style={styles.summarySection} wrap={false}>
          <Text style={styles.summaryText}>{sanitizePdfText(data.personalInfo.summary)}</Text>
        </View>
      )}

      {/* ═══ EXPERIENCE */}
      {data.experience.length > 0 && (
        <View style={styles.experienceSection}>
          <View style={styles.sectionDivider}>
            <View style={styles.sectionRule} />
            <Text style={styles.sectionLabel}>Pengalaman Profesional</Text>
            <View style={styles.sectionRule} />
          </View>

          {data.experience.map((exp, i) => (
            <View
              key={exp.id}
              style={i < data.experience.length - 1 ? styles.expItem : styles.expItemLast}
              wrap={false}
            >
              <View style={styles.itemTopRow}>
                <Text style={styles.itemTitle}>{exp.role}</Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} — {exp.endDate || "Sekarang"}
                </Text>
              </View>

              <Text style={styles.itemSubtitle}>
                {exp.company}
                {exp.location ? (
                  <Text style={styles.itemLocation}> · {exp.location}</Text>
                ) : null}
              </Text>

              {exp.description && <Description text={exp.description} />}
            </View>
          ))}
        </View>
      )}

      {/* ═══ BOTTOM GRID: Education + Skills */}
      {(data.education.length > 0 || data.skills.length > 0) && (
        <View style={styles.bottomGrid}>

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.bottomCol} wrap={false}>
              <View style={styles.sectionDividerLeft}>
                <Text style={styles.sectionLabelLeft}>Pendidikan</Text>
                <View style={styles.sectionRuleLeft} />
              </View>

              {data.education.map((edu, i) => (
                <View
                  key={edu.id}
                  style={[
                    styles.eduItem,
                    i < data.education.length - 1
                      ? {
                        borderBottomWidth: "0.5pt",
                        borderBottomColor: "#f0ece4",
                        borderBottomStyle: "solid",
                        paddingBottom: "10pt",
                      }
                      : {},
                  ]}
                  wrap={false}
                >
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  {edu.fieldOfStudy && (
                    <Text style={styles.eduField}>dalam {edu.fieldOfStudy}</Text>
                  )}
                  <Text style={styles.eduInstitution}>{edu.institution}</Text>
                  <Text style={styles.eduDate}>
                    {edu.startDate} — {edu.endDate || "Sekarang"}
                  </Text>
                  {edu.description && (
                    <Text style={styles.eduDescription}>
                      {sanitizePdfText(edu.description)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <View style={styles.bottomCol} wrap={false}>
              <View style={styles.sectionDividerLeft}>
                <Text style={styles.sectionLabelLeft}>Keahlian</Text>
                <View style={styles.sectionRuleLeft} />
              </View>

              {data.skills.map((skill) => (
                <View key={skill.id} style={styles.skillItem}>
                  <Text style={styles.skillDiamond}>•</Text>
                  <Text style={styles.skillName}>{skill.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

    </Page>
  );
};