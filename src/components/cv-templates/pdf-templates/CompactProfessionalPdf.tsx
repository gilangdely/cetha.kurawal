import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";

const styles = StyleSheet.create({
  page: {
    padding: "35pt",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    color: "#334155",
    lineHeight: 1.2,
  },
  container: {
    borderWidth: "1pt",
    borderColor: "#e2e8f0",
    borderStyle: "solid",
    height: "100%",
  },
  header: {
    padding: "25pt",
    borderBottomWidth: "1pt",
    borderBottomColor: "#e2e8f0",
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: "24pt",
    fontWeight: 700,
    color: "#0f172a",
  },
  contactBox: {
    alignItems: "flex-end",
    gap: "2pt",
  },
  contactText: {
    fontSize: "9pt",
    color: "#64748b",
  },
  content: {
    flexDirection: "row",
    flex: 1,
  },
  leftCol: {
    width: "180pt",
    borderRightWidth: "1pt",
    borderRightColor: "#e2e8f0",
    borderStyle: "solid",
    padding: "20pt",
    backgroundColor: "#f8fafc",
  },
  rightCol: {
    flex: 1,
    padding: "20pt",
  },
  sectionTitle: {
    fontSize: "10pt",
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "1pt",
    marginBottom: "12pt",
  },
  section: {
    marginBottom: "20pt",
  },
  summaryText: {
    fontSize: "9.5pt",
    lineHeight: 1.5,
  },
  item: {
    marginBottom: "15pt",
  },
  itemTitle: {
    fontSize: "11pt",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "2pt",
  },
  itemSubtitle: {
    fontSize: "9.5pt",
    fontWeight: 600,
    color: "#2563eb",
    marginBottom: "4pt",
  },
  itemDescription: {
    fontSize: "9pt",
    lineHeight: 1.4,
  },
  skillBadge: {
    fontSize: "9pt",
    color: "#334155",
    marginBottom: "6pt",
    borderLeftWidth: "2pt",
    borderLeftColor: "#2563eb",
    borderLeftStyle: "solid",
    paddingLeft: "6pt",
  },
});

export const CompactProfessionalPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor = style.fontColor || "#0f172a";

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: primaryColor }]}>{data.personalInfo.fullName || "User"}</Text>
          <View style={styles.contactBox}>
            <Text style={styles.contactText}>{data.personalInfo.email}</Text>
            <Text style={styles.contactText}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactText}>{data.personalInfo.location}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.leftCol}>
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.summaryText}>{data.personalInfo.summary}</Text>
            </View>

            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Expertise</Text>
              {data.skills.map((skill) => (
                <Text key={skill.id} style={[styles.skillBadge, { borderLeftColor: primaryColor }]}>{skill.name}</Text>
              ))}
            </View>
          </View>

          <View style={styles.rightCol}>
            {data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {data.experience.map((exp) => (
                  <View key={exp.id} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{exp.role}</Text>
                    <Text style={[styles.itemSubtitle, { color: primaryColor }]}>{exp.company} | {exp.startDate} - {exp.endDate || "Present"}</Text>
                    {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu) => (
                  <View key={edu.id} style={styles.item} wrap={false}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={[styles.itemSubtitle, { color: primaryColor }]}>{edu.institution} | {edu.startDate}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </Page>
  );
};
