"use client";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import {
  GlobalSettings,
  CustomItem,
  CustomHeaderField,
} from "@/types/resume";
import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface CustomSectionProps {
  sectionId: string;
  title: string;
  items: CustomItem[];
  globalSettings?: GlobalSettings;
  showTitle?: boolean;
}

const CustomSection = ({
  sectionId,
  title,
  items,
  globalSettings,
  showTitle = true,
}: CustomSectionProps) => {
  const { setActiveSection } = useResumeStore();
  const visibleItems = items?.filter((item) => {
    const hasHeader =
      item.headerFields?.some((f) => Boolean(f.value)) || item.title;
    return item.visible && (hasHeader || item.description);
  });

  const centerSubtitle = globalSettings?.centerSubtitle;
  const allowWrap = globalSettings?.wrapFields;
  const formatHtml = (value?: string) => ({
    __html: (value || "").replace(/\n/g, "<br />"),
  });

  const buildHeaderFields = (item: CustomItem): CustomHeaderField[] => {
    if (item.headerFields?.length) return item.headerFields;
    const defaults: CustomHeaderField[] = [
      {
        id: "title",
        label: "",
        value: item.title,
        align: "left",
        bold: true,
        fontSize: globalSettings?.subheaderSize || 16,
      },
      {
        id: "subtitle",
        label: "",
        value: item.subtitle,
        align: centerSubtitle ? "center" : "left",
        bold: false,
        fontSize: globalSettings?.baseFontSize || 14,
      },
      {
        id: "dateRange",
        label: "",
        value: item.dateRange,
        align: "right",
        bold: false,
        fontSize: globalSettings?.baseFontSize || 14,
      },
    ];

    return defaults.filter((field) => field.value);
  };

  return (
    <motion.div
      className="hover:cursor-pointer hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
      style={{
        marginTop: `${globalSettings?.sectionSpacing || 24}px`,
      }}
      onClick={() => {
        setActiveSection(sectionId);
      }}
    >
      <SectionTitle
        title={title}
        type="custom"
        globalSettings={globalSettings}
        showTitle={showTitle}
      />
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item) => (
          <motion.div
            key={item.id}
            layout="position"
            style={{
              marginTop: `${globalSettings?.paragraphSpacing}px`,
            }}
          >
            <motion.div
              layout="position"
              className="grid auto-cols-[minmax(160px,1fr)] grid-flow-col gap-3 items-center overflow-x-auto"
            >
              {buildHeaderFields(item)
                .filter((field) => field.visible !== false)
                .map((field) => (
                <div
                  key={field.id}
                  className={cn(
                    "flex items-center gap-1",
                    field.align === "center" && "justify-center",
                    field.align === "right" && "justify-end",
                    allowWrap ? "whitespace-normal break-words" : "truncate"
                  )}
                  style={{
                    fontSize: `${field.fontSize || globalSettings?.baseFontSize || 14}px`,
                    fontWeight: field.bold ? 700 : 400,
                  }}
                >
                  {field.showIcon && field.icon && (
                    (() => {
                      const IconComp =
                        Icons[field.icon as keyof typeof Icons];
                      return IconComp ? (
                        <IconComp className="w-4 h-4 shrink-0" />
                      ) : null;
                    })()
                  )}
                  {field.label && (
                    <span className="text-subtitleFont">{field.label}</span>
                  )}
                  <span
                    className={cn(
                      allowWrap
                        ? "whitespace-pre-line break-words"
                        : "truncate"
                    )}
                    dangerouslySetInnerHTML={formatHtml(field.value)}
                  />
                </div>
              ))}
            </motion.div>

            {!centerSubtitle && item.subtitle && (
              <motion.div layout="position" className="text-subtitleFont mt-1">
                {item.subtitle}
              </motion.div>
            )}

            {item.description && (
              <motion.div
                layout="position"
                className="mt-2 text-baseFont"
                style={{
                  fontSize: `${globalSettings?.baseFontSize || 14}px`,
                  lineHeight: globalSettings?.lineHeight || 1.6,
                }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomSection;
