import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";

const styles = StyleSheet.create({
  page: {
    padding: "40pt",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    color: "#2d3748",
    lineHeight: 1.2,
  },
  header: {
    backgroundColor: "#1a202c",
    margin: "-40pt",
    marginBottom: "30pt",
    padding: "40pt",
    paddingBottom: "25pt",
  },
  name: {
    fontSize: "26pt",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "4pt",
  },
  jobTitle: {
    fontSize: "14pt",
    color: "#a0aec0",
    fontWeight: 500,
    marginBottom: "15pt",
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "15pt",
  },
  contactItem: {
    fontSize: "9pt",
    color: "#e2e8f0",
  },
  mainContent: {
    flexDirection: "row",
    gap: "30pt",
  },
  leftCol: {
    flex: 2,
  },
  rightCol: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: "12pt",
    fontWeight: 700,
    color: "#1a202c",
    borderBottomWidth: "2pt",
    borderBottomColor: "#edf2f7",
    borderStyle: "solid",
    paddingBottom: "5pt",
    marginBottom: "12pt",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: "18pt",
  },
  sidebarSection: {
    marginBottom: "18pt",
  },
  item: {
    marginBottom: "15pt",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "4pt",
  },
  itemTitle: {
    fontSize: "11pt",
    fontWeight: 700,
    color: "#2d3748",
  },
  itemDate: {
    fontSize: "9pt",
    color: "#718096",
    fontWeight: 600,
  },
  itemSubtitle: {
    fontSize: "10pt",
    fontWeight: 600,
    color: "#4a5568",
    marginBottom: "5pt",
  },
  itemDescription: {
    fontSize: "9.5pt",
    color: "#4a5568",
    lineHeight: 1.4,
  },
  skillBadge: {
    backgroundColor: "#edf2f7",
    paddingHorizontal: "8pt",
    paddingVertical: "4pt",
    borderRadius: "4pt",
    fontSize: "8.5pt",
    marginBottom: "5pt",
    marginRight: "5pt",
    fontWeight: 600,
    color: "#2d3748",
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export const ExecutiveMinimalistPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor = style.fontColor || "#1a202c";

  return (
    <Page size="A4" style={styles.page}>
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <Text style={styles.name}>{data.personalInfo.fullName || "User"}</Text>
        <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text>
        <View style={styles.contactGrid}>
          <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
          <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
          <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.leftCol}>
          {data.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {data.experience.map((exp) => (
                <View key={exp.id} style={styles.item} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{exp.role}</Text>
                    <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate || "Present"}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
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
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate || "Present"}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.rightCol}>
          {data.personalInfo.summary && (
            <View style={styles.sidebarSection} wrap={false}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.itemDescription}>{data.personalInfo.summary}</Text>
            </View>
          )}

          {data.skills.length > 0 && (
            <View style={styles.sidebarSection} wrap={false}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsWrap}>
                {data.skills.map((skill) => (
                  <Text key={skill.id} style={styles.skillBadge}>{skill.name}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </Page>
  );
};
