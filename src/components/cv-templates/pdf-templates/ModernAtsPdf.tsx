import { Page, Text, View, StyleSheet, Image as PdfImage } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";
import { sanitizePdfText } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: "40pt",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    lineHeight: 1.2,
  },
  header: {
    marginBottom: "24pt",
    flexDirection: "row",
    gap: "18pt",
    alignItems: "flex-start",
  },
  photo: {
    width: "72pt",
    height: "72pt",
    borderRadius: "12pt",
    borderWidth: "1pt",
    borderColor: "rgba(37, 99, 235, 0.2)",
    borderStyle: "solid",
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: "27pt",
    fontWeight: 800,
    color: "#2563eb",
    marginBottom: "6pt",
  },
  jobTitle: {
    fontSize: "18pt",
    fontWeight: 600,
    marginBottom: "9pt",
    opacity: 0.9,
  },
  contactText: {
    fontSize: "10.5pt",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "12pt",
    opacity: 0.7,
    fontWeight: 500,
  },
  section: {
    marginBottom: "15pt",
  },
  sectionTitle: {
    fontSize: "13pt",
    fontWeight: 700,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "1pt",
    marginBottom: "6pt",
  },
  line: {
    height: "1pt",
    backgroundColor: "#e5e7eb",
    marginBottom: "8pt",
  },
  summary: {
    fontSize: "10.5pt",
    lineHeight: 1.5,
    opacity: 0.9,
  },
  item: {
    marginBottom: "12pt",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "3pt",
  },
  itemTitle: {
    fontSize: "12pt",
    fontWeight: 700,
  },
  itemDateBadge: {
    fontSize: "10pt",
    fontWeight: 600,
    color: "#2563eb",
  },
  itemSubtitle: {
    fontSize: "10pt",
    fontWeight: 500,
    marginBottom: "4pt",
  },
  itemDescription: {
    fontSize: "10.5pt",
    lineHeight: 1.4,
    opacity: 0.9,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "6pt",
  },
  skillBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: "8pt",
    paddingVertical: "3pt",
    borderRadius: "4pt",
    fontSize: "10pt",
    fontWeight: 500,
    color: "#374151",
  },
});

export const ModernAtsPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor = "#2563eb"; // Accent theme remains fixed to match modern-ats.tsx

  return (
    <Page size="A4" style={[styles.page, style?.fontColor ? { color: style.fontColor } : {}]}>
      <View style={styles.header}>
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
          <PdfImage src={data.personalInfo.photoUrl} style={styles.photo} />
        )}
        <View style={styles.headerContent}>
          <Text style={styles.name}>{data.personalInfo.fullName || "Nama Lengkap"}</Text>
          <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text>
          <View style={styles.contactText}>
            {data.personalInfo.email && <Text>{data.personalInfo.email}</Text>}
            {data.personalInfo.phone && <Text>{data.personalInfo.phone}</Text>}
            {data.personalInfo.location && <Text>{data.personalInfo.location}</Text>}
            {data.personalInfo.linkedin && <Text>{data.personalInfo.linkedin}</Text>}
            {data.personalInfo.portfolio && <Text>{data.personalInfo.portfolio}</Text>}
          </View>
        </View>
      </View>

      {data.personalInfo.summary && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.line} />
          <Text style={styles.summary}>{sanitizePdfText(data.personalInfo.summary)}</Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <View style={styles.line} />
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.role}</Text>
                <View style={styles.itemDateBadge}>
                  <Text>{exp.startDate} - {exp.endDate || "Present"}</Text>
                </View>
              </View>
              <Text style={styles.itemSubtitle}>{exp.company}{exp.location ? ` • ${exp.location}` : ""}</Text>
              {exp.description && <Text style={styles.itemDescription}>{sanitizePdfText(exp.description)}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.line} />

          <View style={{ flexDirection: "column", gap: "16pt" }}>
            {data.education.map((edu) => (
              <View key={edu.id} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {edu.degree}
                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                  </Text>
                  <Text style={styles.itemDateBadge}>
                    {edu.startDate} - {edu.endDate || "Present"}
                  </Text>
                </View>

                <Text style={[styles.itemSubtitle, { fontWeight: 500, opacity: 0.8 }]}>
                  {edu.institution}
                </Text>

                {edu.description && (
                  <Text style={[styles.itemDescription, { marginTop: "4pt", lineHeight: 1.6, opacity: 0.9 }]}>
                    {sanitizePdfText(edu.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {data.skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.line} />
          <View style={styles.skillContainer}>
            {data.skills.map((skill) => (
              <Text key={skill.id} style={styles.skillBadge}>{skill.name}</Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
};