import { Page, Text, View, StyleSheet, Image as PdfImage } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";
import { sanitizePdfText } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: "44pt 50pt",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    color: "#1a1a1a",
    lineHeight: 1.3,
    fontSize: "10pt",
  },

  // ─── HEADER ──────────────────────────────────────────────────────────
  header: {
    alignItems: "center",
    marginBottom: "20pt",
    paddingBottom: "14pt",
    borderBottomWidth: "2pt",
    borderBottomStyle: "solid",
    borderBottomColor: "#1a1a1a",
  },
  headerWithPhoto: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "24pt",  // tambah dari 20pt
    paddingBottom: "18pt", // tambah dari 14pt
    borderBottomWidth: "2pt",
    borderBottomStyle: "solid",
    borderBottomColor: "#1a1a1a",
    gap: "22pt",           // tambah dari 18pt
  },
  photo: {
    width: "64pt",         // sedikit lebih besar
    height: "64pt",
    borderRadius: "4pt",
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: "22pt",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "1.5pt",
    marginBottom: "10pt",  // tambah dari 4pt
    color: "#1a1a1a",
  },
  jobTitle: {
    fontSize: "10pt",
    fontWeight: 500,
    color: "#6b7280",
    letterSpacing: "0.5pt",
    marginBottom: "6pt",  // tambah dari 8pt
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "4pt",
    justifyContent: "center",
  },
  contactRowLeft: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "4pt",
  },
  contactItem: {
    fontSize: "8.5pt",
    fontWeight: 500,
    color: "#4b5563",
    lineHeight: 1.5,  // tambahkan ini
  },
  contactSep: {
    fontSize: "8.5pt",
    color: "#d1d5db",
  },

  // ─── SECTION ─────────────────────────────────────────────────────────
  section: {
    marginBottom: "16pt",
  },
  sectionTitle: {
    fontSize: "8.5pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.5pt",
    paddingBottom: "4pt",
    marginBottom: "10pt",
    borderBottomWidth: "1pt",
    borderBottomStyle: "solid",
    borderBottomColor: "#1a1a1a",
  },

  // ─── SUMMARY ─────────────────────────────────────────────────────────
  summary: {
    fontSize: "9.5pt",
    lineHeight: 1.65,
    color: "#374151",
  },

  // ─── EXPERIENCE / EDUCATION ITEM ─────────────────────────────────────
  item: {
    marginBottom: "11pt",
    paddingBottom: "11pt",
    borderBottomWidth: "0.5pt",
    borderBottomStyle: "solid",
    borderBottomColor: "#f3f4f6",
  },
  itemLast: {
    marginBottom: "0pt",
    paddingBottom: "0pt",
    borderBottomWidth: 0,
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "1pt",
  },
  itemTitle: {
    fontSize: "10.5pt",
    fontWeight: 700,
    color: "#111827",
    flex: 1,
    paddingRight: "8pt",
  },
  itemDate: {
    fontSize: "8.5pt",
    fontWeight: 600,
    color: "#6b7280",
    flexShrink: 0,
  },
  itemSubtitle: {
    fontSize: "9pt",
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: "5pt",
  },

  // ─── BULLET DESCRIPTION ──────────────────────────────────────────────
  bulletRow: {
    flexDirection: "row",
    gap: "5pt",
    marginBottom: "2pt",
  },
  bulletDash: {
    fontSize: "9.5pt",
    color: "#9ca3af",
    lineHeight: 1.55,
  },
  bulletText: {
    flex: 1,
    fontSize: "9.5pt",
    lineHeight: 1.55,
    color: "#374151",
  },
  plainDescription: {
    fontSize: "9.5pt",
    lineHeight: 1.55,
    color: "#374151",
  },

  // ─── SKILLS ──────────────────────────────────────────────────────────
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "6pt",
  },
  skillItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: "4pt",
    width: "30%",
    marginBottom: "3pt",
  },
  skillDot: {
    width: "3pt",
    height: "3pt",
    borderRadius: "2pt",
    backgroundColor: "#9ca3af",
    flexShrink: 0,
  },
  skillText: {
    fontSize: "9.5pt",
    fontWeight: 500,
    color: "#374151",
  },
});

// Description: multi-line → dash bullets, single → plain
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
          <Text style={styles.bulletDash}>-</Text>
          <Text style={styles.bulletText}>{line}</Text>
        </View>
      ))}
    </View>
  );
};

// Contact items with | separator
const ContactItems = ({
  items,
  rowStyle,
}: {
  items: string[];
  rowStyle: object;
}) => {

  const filtered = items.filter(Boolean);
  return (
    <View style={rowStyle}>
      {filtered.map((item, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
          {i > 0 && (
            <Text style={[styles.contactSep, { marginRight: "4pt" }]}>|</Text>
          )}
          <Text style={styles.contactItem}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export const ClassicAtsPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor: string = style?.fontColor || "#1a1a1a";
  const hasPhoto = data.personalInfo.showPhoto && data.personalInfo.photoUrl;

  const contactItems = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.portfolio,
  ].filter(Boolean) as string[];

  return (
    <Page size="A4" style={styles.page}>

      {/* ═══ HEADER */}
      {hasPhoto ? (
        <View style={[styles.headerWithPhoto, { borderBottomColor: primaryColor }]}>
          <PdfImage src={data.personalInfo.photoUrl!} style={styles.photo} />
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: primaryColor }]}>
              {data.personalInfo.fullName || "Nama Lengkap"}
            </Text>
            {data.personalInfo.jobTitle && (
              <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text>
            )}
            <ContactItems items={contactItems} rowStyle={styles.contactRowLeft} />
          </View>
        </View>
      ) : (
        <View style={[styles.header, { borderBottomColor: primaryColor }]}>
          <Text style={[styles.name, { color: primaryColor }]}>
            {data.personalInfo.fullName || "Nama Lengkap"}
          </Text>
          {data.personalInfo.jobTitle && (
            <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text>
          )}
          <ContactItems items={contactItems} rowStyle={styles.contactRow} />
        </View>
      )}

      {/* ═══ SUMMARY */}
      {data.personalInfo.summary && (
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>
            Professional Summary
          </Text>
          <Text style={styles.summary}>{sanitizePdfText(data.personalInfo.summary)}</Text>
        </View>
      )}

      {/* ═══ EXPERIENCE */}
      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>
            Work Experience
          </Text>
          {data.experience.map((exp, i) => (
            <View
              key={exp.id}
              style={i < data.experience.length - 1 ? styles.item : styles.itemLast}
              wrap={false}
            >
              <View style={styles.itemTopRow}>
                <Text style={styles.itemTitle}>{exp.role}</Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.endDate || "Present"}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {exp.company}{exp.location ? `, ${exp.location}` : ""}
              </Text>
              {exp.description && <Description text={exp.description} />}
            </View>
          ))}
        </View>
      )}

      {/* ═══ EDUCATION */}
      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>
            Education
          </Text>
          {data.education.map((edu, i) => (
            <View
              key={edu.id}
              style={i < data.education.length - 1 ? styles.item : styles.itemLast}
              wrap={false}
            >
              <View style={styles.itemTopRow}>
                <Text style={styles.itemTitle}>
                  {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                </Text>
                <Text style={styles.itemDate}>
                  {edu.startDate} - {edu.endDate || "Present"}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{edu.institution}</Text>
              {edu.description && <Description text={edu.description} />}
            </View>
          ))}
        </View>
      )}

      {/* ═══ SKILLS */}
      {data.skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>
            Core Competencies
          </Text>
          <View style={styles.skillsWrap}>
            {data.skills.map((skill) => (
              <View key={skill.id} style={styles.skillItem}>
                <View style={styles.skillDot} />
                <Text style={styles.skillText}>{skill.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

    </Page>
  );
};