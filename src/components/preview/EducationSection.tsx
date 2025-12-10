"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Education, GlobalSettings } from "@/types/resume";
import SectionTitle from "./SectionTitle";
import { useResumeStore } from "@/store/useResumeStore";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface EducationSectionProps {
  education?: Education[];
  globalSettings?: GlobalSettings;
  showTitle?: boolean;
}

const EducationSection = ({
  education,
  globalSettings,
  showTitle = true,
}: EducationSectionProps) => {
  const { setActiveSection } = useResumeStore();
  const locale = useLocale();
  const visibleEducation = education?.filter((edu) => edu.visible);
  const allowWrap = globalSettings?.wrapFields;
  const formatHtml = (value?: string) => ({
    __html: (value || "").replace(/\n/g, "<br />"),
  });
  return (
    <motion.div
      className="
      hover:cursor-pointer
      hover:bg-gray-100
      rounded-md
      transition-all
      duration-300
      ease-in-out
      hover:shadow-md"
      style={{
        marginTop: `${globalSettings?.sectionSpacing || 24}px`,
      }}
      onClick={() => {
        setActiveSection("education");
      }}
    >
      <SectionTitle
        type="education"
        globalSettings={globalSettings}
        showTitle={showTitle}
      ></SectionTitle>
      <AnimatePresence mode="popLayout">
        {visibleEducation?.map((edu) => (
          <motion.div
            layout="position"
            key={edu.id}
            style={{
              marginTop: `${globalSettings?.paragraphSpacing}px`,
            }}
          >
            <motion.div
              layout="position"
              className={`grid grid-cols-${
                globalSettings?.centerSubtitle ? "3" : "2"
              } gap-2 items-center justify-items-start [&>*:last-child]:justify-self-end`}
            >
              <div
                className={cn(
                  "font-bold",
                  allowWrap
                    ? "whitespace-pre-line break-words"
                    : "truncate"
                )}
                style={{
                  fontSize: `${globalSettings?.subheaderSize || 16}px`,
                }}
                dangerouslySetInnerHTML={formatHtml(edu.school)}
              />

              {globalSettings?.centerSubtitle && (
                <motion.div
                  layout="position"
                  className={cn(
                    "text-subtitleFont",
                    allowWrap
                      ? "whitespace-pre-line break-words"
                      : "truncate"
                  )}
                  dangerouslySetInnerHTML={formatHtml(
                    `${[edu.major, edu.degree]
                      .filter(Boolean)
                      .join(" · ")}${edu.gpa ? ` · GPA ${edu.gpa}` : ""}`
                  )}
                />
              )}

              <span
                className={cn(
                  "text-subtitleFont",
                  allowWrap
                    ? "whitespace-pre-line break-words"
                    : "shrink-0 truncate"
                )}
                suppressHydrationWarning
              >
                {`${new Date(edu.startDate).toLocaleDateString(
                  locale
                )} - ${new Date(edu.endDate).toLocaleDateString(locale)}`}
              </span>
            </motion.div>

            {!globalSettings?.centerSubtitle && (
              <motion.div
                layout="position"
                className={cn(
                  "text-subtitleFont mt-1",
                  allowWrap
                    ? "whitespace-pre-line break-words"
                    : "truncate"
                )}
                dangerouslySetInnerHTML={formatHtml(
                  `${[edu.major, edu.degree]
                    .filter(Boolean)
                    .join(" · ")}${edu.gpa ? ` · GPA ${edu.gpa}` : ""}`
                )}
              />
            )}

            {edu.description && (
              <motion.div
                layout="position"
                className="mt-2 text-baseFont"
                style={{
                  fontSize: `${globalSettings?.baseFontSize || 14}px`,
                  lineHeight: globalSettings?.lineHeight || 1.6,
                }}
                dangerouslySetInnerHTML={{ __html: edu.description }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default EducationSection;
