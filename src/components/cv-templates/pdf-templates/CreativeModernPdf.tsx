import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    color: "#111827",
    lineHeight: 1.2,
  },
  sidebar: {
    width: "30%",
    backgroundColor: "rgba(37, 99, 235, 0.05)",
    padding: "24pt",
    height: "100%",
    borderRightWidth: "0.5pt",
    borderRightColor: "rgba(37, 99, 235, 0.1)",
    borderRightStyle: "solid",
  },
  photoContainer: {
    marginBottom: "20pt",
    alignItems: "center",
  },
  photo: {
    width: "80pt",
    height: "80pt",
    borderRadius: "40pt",
    borderWidth: "3pt",
    borderColor: "#ffffff",
    borderStyle: "solid",
  },
  sectionTitleSidebar: {
    color: "#2563eb",
    borderBottomWidth: "1.5pt",
    borderBottomColor: "rgba(37, 99, 235, 0.2)",
    borderBottomStyle: "solid",
    paddingBottom: "3pt",
    fontSize: "9pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1pt",
    marginBottom: "10pt",
    marginTop: "16pt",
  },
  contactItem: {
    fontSize: "8.5pt",
    fontWeight: 400,
    color: "#4b5563",
    marginBottom: "6pt",
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "5pt",
  },
  skillBadge: {
    backgroundColor: "#ffffff",
    paddingHorizontal: "7pt",
    paddingVertical: "3pt",
    borderRadius: "5pt",
    fontSize: "7.5pt",
    fontWeight: 600,
    color: "#2563eb",
    marginBottom: "4pt",
  },
  main: {
    width: "70%",
    padding: "30pt",
  },
  name: {
    fontSize: "26pt",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "4pt",
  },
  jobTitle: {
    color: "#2563eb",
    fontSize: "13pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1pt",
    marginBottom: "25pt",
  },
  section: {
    marginBottom: "18pt",
  },
  sectionTitleMain: {
    marginBottom: "10pt",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIndicator: {
    width: "18pt",
    height: "5pt",
    backgroundColor: "#2563eb",
  },
  sectionTitleText: {
    color: "#2563eb",
    fontSize: "11pt",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1pt",
    marginLeft: "8pt",
  },
  summary: {
    fontSize: "9.5pt",
    lineHeight: 1.5,
    color: "#374151",
  },
  experienceItem: {
    marginBottom: "12pt",
    paddingLeft: "12pt",
    position: "relative",
  },
  experienceDot: {
    position: "absolute",
    left: 0,
    top: "5pt",
    width: "5pt",
    height: "5pt",
    borderRadius: "2.5pt",
    backgroundColor: "rgba(37, 99, 235, 0.5)",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "3pt",
  },
  itemTitle: {
    fontSize: "10.5pt",
    fontWeight: 700,
  },
  itemDate: {
    fontSize: "8.5pt",
    color: "#6b7280",
  },
  itemSubtitle: {
    fontSize: "9.5pt",
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: "4pt",
  },
  itemDescription: {
    fontSize: "9pt",
    lineHeight: 1.4,
    color: "#374151",
  },
});

export const CreativeModernPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor = style.fontColor || "#2563eb";

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar}>
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
          <View style={styles.photoContainer}>
            <Image src={data.personalInfo.photoUrl} style={styles.photo} />
          </View>
        )}
        
        <Text style={[styles.sectionTitleSidebar, { color: primaryColor, borderBottomColor: primaryColor + "33" }]}>Kontak</Text>
        <View>
          {data.personalInfo.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
          {data.personalInfo.location && <Text style={styles.contactItem}>{data.personalInfo.location}</Text>}
        </View>

        {data.skills.length > 0 && (
          <View>
            <Text style={[styles.sectionTitleSidebar, { color: primaryColor, borderBottomColor: primaryColor + "33" }]}>Keahlian</Text>
            <View style={styles.skillContainer}>
              {data.skills.map((skill) => (
                <Text key={skill.id} style={[styles.skillBadge, { color: primaryColor }]}>{skill.name}</Text>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.main}>
        <Text style={styles.name}>{data.personalInfo.fullName || "Nama Lengkap"}</Text>
        <Text style={[styles.jobTitle, { color: primaryColor }]}>{data.personalInfo.jobTitle}</Text>

        {data.personalInfo.summary && (
          <View style={styles.section} wrap={false}>
            <View style={styles.sectionTitleMain}>
              <View style={[styles.sectionIndicator, { backgroundColor: primaryColor }]} />
              <Text style={[styles.sectionTitleText, { color: primaryColor }]}>Profil</Text>
            </View>
            <Text style={styles.summary}>{data.personalInfo.summary}</Text>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleMain}>
              <View style={[styles.sectionIndicator, { backgroundColor: primaryColor }]} />
              <Text style={[styles.sectionTitleText, { color: primaryColor }]}>Pengalaman</Text>
            </View>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem} wrap={false}>
                <View style={[styles.experienceDot, { backgroundColor: primaryColor + "80" }]} />
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.role}</Text>
                  <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate || "Sekarang"}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}{exp.location ? ` • ${exp.location}` : ""}</Text>
                {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleMain}>
              <View style={[styles.sectionIndicator, { backgroundColor: primaryColor }]} />
              <Text style={[styles.sectionTitleText, { color: primaryColor }]}>Pendidikan</Text>
            </View>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.experienceItem} wrap={false}>
                <View style={[styles.experienceDot, { backgroundColor: primaryColor + "80" }]} />
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}</Text>
                  <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate || "Sekarang"}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                {edu.description && <Text style={styles.itemDescription}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
};
