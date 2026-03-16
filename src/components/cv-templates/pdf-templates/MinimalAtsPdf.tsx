import { Page, Text, View, StyleSheet, Image as PdfImage } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";
import { sanitizePdfText } from "@/lib/utils";

// w-32 = 128px ≈ 91pt, gap-4 = 16px ≈ 12pt
const LABEL_WIDTH = "91pt";
const SECTION_GAP = "12pt";

const styles = StyleSheet.create({
  page: {
    padding: "40pt",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    lineHeight: 1.4,
  },

  // ─── HEADER: flex-row items-end justify-between ───────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32pt",
    paddingBottom: "24pt",
    borderBottomWidth: "0.75pt",
    borderBottomColor: "#d1d5db",
    borderBottomStyle: "solid",
    gap: "16pt",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: "20pt",
  },
  photo: {
    width: "56pt",
    height: "56pt",
    borderRadius: "5pt",
    borderWidth: "0.75pt",
    borderColor: "#e5e7eb",
    borderStyle: "solid",
  },
  name: {
    fontSize: "24pt",
    fontWeight: 300,          // font-light
    letterSpacing: "-0.5pt",  // tracking-tight
    marginBottom: "3pt",
  },
  jobTitle: {
    fontSize: "10pt",
    fontWeight: 400,
    letterSpacing: "2pt",     // tracking-widest
    textTransform: "uppercase",
    opacity: 0.6,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2pt",
  },
  contactItem: {
    fontSize: "9pt",
    opacity: 0.6,
    textAlign: "right",
  },

  // ─── SECTION ROW: flex-row gap-4 ─────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    gap: SECTION_GAP,
    marginBottom: "32pt",
  },
  sectionLabel: {
    width: LABEL_WIDTH,
    flexShrink: 0,
    paddingTop: "2pt",
    fontSize: "7.5pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.8pt",
    opacity: 0.5,
  },
  sectionContent: {
    flex: 1,
  },

  // ─── SUMMARY ─────────────────────────────────────────────────────────
  summary: {
    fontSize: "9.5pt",
    lineHeight: 1.6,
    opacity: 0.9,
  },

  // ─── EXP / EDU ITEMS ─────────────────────────────────────────────────
  itemGroup: {
    flexDirection: "column",
    gap: "24pt",
  },
  item: {
    // no extra margin — gap handles spacing
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "2pt",
  },
  itemTitle: {
    fontSize: "11pt",
    fontWeight: 600,
  },
  itemDate: {
    fontSize: "8pt",
    fontWeight: 500,
    letterSpacing: "0.8pt",
    opacity: 0.5,
    flexShrink: 0,
    marginLeft: "16pt",
  },
  itemSubtitle: {
    fontSize: "9.5pt",
    fontWeight: 500,
    opacity: 0.8,
    marginBottom: "6pt",
  },
  itemDescription: {
    fontSize: "9.5pt",
    lineHeight: 1.6,
    opacity: 0.8,
  },

  // ─── SKILLS ──────────────────────────────────────────────────────────
  skillsText: {
    fontSize: "9.5pt",
    lineHeight: 1.6,
    opacity: 0.9,
  },

  bulletRow: {
    flexDirection: "row",
    gap: "5pt",
    marginBottom: "2pt",
  },
  bulletDash: {
    fontSize: "9.5pt",
    opacity: 0.5,
    lineHeight: 1.6,
  },
  bulletText: {
    flex: 1,
    fontSize: "9.5pt",
    lineHeight: 1.6,
    opacity: 0.8,
  },
});
const Description = ({ text }: { text: string }) => {
  const lines = sanitizePdfText(text)
    .split("\n")
    .map((l) => l.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return <Text style={styles.itemDescription}>{sanitizePdfText(text)}</Text>;
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
export const MinimalAtsPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const baseColor: string = style?.fontColor || "#262626";
  const hasPhoto = data.personalInfo.showPhoto && data.personalInfo.photoUrl;

  return (
    <Page size="A4" style={[styles.page, { color: baseColor }]}>

      {/* ═══ HEADER ════════════════════════════════════════════════════ */}
      <View style={styles.header}>
        {/* Left: photo + name/title */}
        <View style={styles.headerLeft}>
          {hasPhoto && (
            <PdfImage src={data.personalInfo.photoUrl!} style={styles.photo} />
          )}
          <View>
            <Text style={styles.name}>
              {data.personalInfo.fullName || "Nama Lengkap"}
            </Text>
            {data.personalInfo.jobTitle && (
              <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text>
            )}
          </View>
        </View>

        {/* Right: contact, text-align right */}
        <View style={styles.headerRight}>
          {data.personalInfo.email && (
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
          )}
          {data.personalInfo.phone && (
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
          )}
          {data.personalInfo.linkedin && (
            <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>
          )}
          {data.personalInfo.location && (
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
          )}
        </View>
      </View>

      {/* ═══ SUMMARY ═══════════════════════════════════════════════════ */}
      {data.personalInfo.summary && (
        <View style={styles.sectionRow} wrap={false}>
          <Text style={styles.sectionLabel}>Profile</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.summary}>
              {sanitizePdfText(data.personalInfo.summary)}
            </Text>
          </View>
        </View>
      )}

      {/* ═══ EXPERIENCE ════════════════════════════════════════════════ */}
      {data.experience.length > 0 && (
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Experience</Text>
          <View style={[styles.sectionContent, styles.itemGroup]}>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.item} wrap={false}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemTitle}>{exp.role}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} — {exp.endDate ? exp.endDate.toUpperCase() : "PRESENT"}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {exp.company}
                  {exp.location ? ` • ${exp.location}` : ""}
                </Text>
                {exp.description && <Description text={exp.description} />}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ═══ EDUCATION ═════════════════════════════════════════════════ */}
      {data.education.length > 0 && (
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Education</Text>
          <View style={[styles.sectionContent, styles.itemGroup]}>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.item} wrap={false}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemTitle}>
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </Text>
                  <Text style={styles.itemDate}>
                    {edu.startDate} — {edu.endDate ? edu.endDate.toUpperCase() : "PRESENT"}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                {edu.description && <Description text={edu.description} />}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ═══ SKILLS ════════════════════════════════════════════════════ */}
      {data.skills.length > 0 && (
        <View style={[styles.sectionRow, { marginBottom: 0 }]} wrap={false}>
          <Text style={styles.sectionLabel}>Skills</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.skillsText}>
              {data.skills.map((s) => s.name).join(" • ")}
            </Text>
          </View>
        </View>
      )}

    </Page>
  );
};