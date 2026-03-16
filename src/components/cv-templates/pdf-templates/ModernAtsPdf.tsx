import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";

const styles = StyleSheet.create({
  page: {
    padding: "40pt",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    color: "#111827",
    lineHeight: 1.2,
  },
  header: {
    marginBottom: "25pt",
    flexDirection: "row",
    gap: "20pt",
    alignItems: "center",
  },
  photo: {
    width: "70pt",
    height: "70pt",
    borderRadius: "12pt",
    borderWidth: "1pt",
    borderColor: "rgba(37, 99, 235, 0.2)",
    borderStyle: "solid",
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: "24pt",
    fontWeight: 700,
    color: "#2563eb",
    marginBottom: "4pt",
  },
  jobTitle: {
    fontSize: "16pt",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "5pt",
  },
  contactText: {
    fontSize: "9pt",
    color: "#6b7280",
    flexDirection: "row",
    gap: "10pt",
  },
  section: {
    marginBottom: "15pt",
  },
  sectionTitle: {
    fontSize: "12pt",
    fontWeight: 700,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "1pt",
    marginBottom: "4pt",
  },
  line: {
    height: "1pt",
    backgroundColor: "#e5e7eb",
    marginBottom: "8pt",
  },
  summary: {
    fontSize: "10pt",
    lineHeight: 1.5,
    color: "#374151",
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
    fontSize: "11pt",
    fontWeight: 700,
  },
  itemDateBadge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: "6pt",
    paddingVertical: "2pt",
    borderRadius: "4pt",
    fontSize: "8.5pt",
    fontWeight: 600,
    color: "#2563eb",
  },
  itemSubtitle: {
    fontSize: "10pt",
    fontWeight: 500,
    color: "#4b5563",
    marginBottom: "4pt",
  },
  itemDescription: {
    fontSize: "9.5pt",
    lineHeight: 1.4,
    color: "#374151",
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
    fontSize: "9pt",
    fontWeight: 500,
    color: "#374151",
  },
});

export const ModernAtsPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor = style.fontColor || "#2563eb";

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
          <Image src={data.personalInfo.photoUrl} style={styles.photo} />
        )}
        <View style={styles.headerContent}>
          <Text style={[styles.name, { color: primaryColor }]}>{data.personalInfo.fullName || "Nama Lengkap"}</Text>
          <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text>
          <View style={styles.contactText}>
            <Text>{data.personalInfo.email}  |  {data.personalInfo.phone}  |  {data.personalInfo.location}</Text>
          </View>
        </View>
      </View>

      {data.personalInfo.summary && (
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Profile</Text>
          <View style={styles.line} />
          <Text style={styles.summary}>{data.personalInfo.summary}</Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Experience</Text>
          <View style={styles.line} />
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.role}</Text>
                <View style={[styles.itemDateBadge, { backgroundColor: primaryColor + "1a", color: primaryColor }]}>
                  <Text>{exp.startDate} - {exp.endDate || "Present"}</Text>
                </View>
              </View>
              <Text style={styles.itemSubtitle}>{exp.company}{exp.location ? ` • ${exp.location}` : ""}</Text>
              {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Education</Text>
          <View style={styles.line} />
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}</Text>
                <View style={[styles.itemDateBadge, { backgroundColor: primaryColor + "1a", color: primaryColor }]}>
                  <Text>{edu.startDate} - {edu.endDate || "Present"}</Text>
                </View>
              </View>
              <Text style={styles.itemSubtitle}>{edu.institution}</Text>
              {edu.description && <Text style={styles.itemDescription}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Skills</Text>
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
