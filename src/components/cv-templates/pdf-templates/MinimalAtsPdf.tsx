import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";

const styles = StyleSheet.create({
  page: {
    padding: "45pt",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    color: "#262626",
    lineHeight: 1.4,
  },
  header: {
    marginBottom: "30pt",
  },
  name: {
    fontSize: "22pt",
    fontWeight: 700,
    letterSpacing: "-0.5pt",
    marginBottom: "2pt",
  },
  jobTitle: {
    fontSize: "12pt",
    color: "#737373",
    fontWeight: 500,
    marginBottom: "10pt",
  },
  contactRow: {
    flexDirection: "row",
    gap: "12pt",
    fontSize: "9pt",
    color: "#525252",
  },
  section: {
    marginBottom: "22pt",
  },
  sectionTitle: {
    fontSize: "10pt",
    fontWeight: 700,
    color: "#a3a3a3",
    textTransform: "uppercase",
    letterSpacing: "1.5pt",
    marginBottom: "12pt",
  },
  summary: {
    fontSize: "10.5pt",
    color: "#404040",
  },
  item: {
    marginBottom: "16pt",
  },
  itemTitle: {
    fontSize: "11pt",
    fontWeight: 700,
    marginBottom: "2pt",
  },
  itemSubtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "6pt",
  },
  itemSubtitle: {
    fontSize: "10pt",
    fontWeight: 500,
    color: "#737373",
  },
  itemDate: {
    fontSize: "10pt",
    color: "#737373",
  },
  itemDescription: {
    fontSize: "10pt",
    color: "#404040",
    lineHeight: 1.5,
  },
  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "20pt",
  },
  skillItem: {
    fontSize: "10pt",
    color: "#404040",
    width: "45%",
  },
});

export const MinimalAtsPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor = style.fontColor || "#262626";

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: primaryColor }]}>{data.personalInfo.fullName || "User"}</Text>
        <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text>
        <View style={styles.contactRow}>
          <Text>{data.personalInfo.email}</Text>
          <Text>•</Text>
          <Text>{data.personalInfo.phone}</Text>
          <Text>•</Text>
          <Text>{data.personalInfo.location}</Text>
        </View>
      </View>

      {data.personalInfo.summary && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.summary}>{data.personalInfo.summary}</Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.item} wrap={false}>
              <Text style={styles.itemTitle}>{exp.role}</Text>
              <View style={styles.itemSubtitleRow}>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>{exp.startDate} – {exp.endDate || "Present"}</Text>
              </View>
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
              <View style={styles.itemSubtitleRow}>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                <Text style={styles.itemDate}>{edu.startDate} – {edu.endDate || "Present"}</Text>
              </View>
              {edu.description && <Text style={styles.itemDescription}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <View style={styles.skillGrid}>
            {data.skills.map((skill) => (
              <Text key={skill.id} style={styles.skillItem}>{skill.name}</Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
};
