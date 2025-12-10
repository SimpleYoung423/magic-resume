import { useCallback, useEffect, useState } from "react";
import {
  motion,
  useDragControls,
  Reorder,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import {
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  Trash2,
  SlidersHorizontal,
  Copy,
} from "lucide-react";
import Field from "../Field";

import {
  CustomHeaderField,
  CustomItem as CustomItemType,
} from "@/types/resume";
import ThemeModal from "@/components/shared/ThemeModal";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateUUID } from "@/utils/uuid";
import { Plus, Trash2 as TrashIcon } from "lucide-react";
import IconSelector from "../IconSelector";
const CustomItemEditor = ({
  item,
  onSave,
}: {
  item: CustomItemType;
  onSave: (item: CustomItemType) => void;
}) => {
  const buildDefaultHeaderFields = useCallback((): CustomHeaderField[] => {
    const defaults: CustomHeaderField[] = [
      {
        id: "title",
        label: "",
        value: item.title,
        align: "left",
        bold: true,
        fontSize: 16,
        icon: "User",
        showIcon: false,
        visible: true,
      },
      {
        id: "subtitle",
        label: "",
        value: item.subtitle,
        align: "left",
        bold: false,
        fontSize: 14,
        icon: "Tag",
        showIcon: false,
        visible: true,
      },
      {
        id: "dateRange",
        label: "",
        value: item.dateRange,
        align: "right",
        bold: false,
        fontSize: 14,
        icon: "Calendar",
        showIcon: false,
        visible: true,
      },
    ];

    return defaults.filter((field) => field.value || field.label);
  }, [item.dateRange, item.subtitle, item.title]);

  const [headerFields, setHeaderFields] = useState<CustomHeaderField[]>(
    item.headerFields?.length ? item.headerFields : buildDefaultHeaderFields()
  );

  useEffect(() => {
    setHeaderFields(
      item.headerFields?.length ? item.headerFields : buildDefaultHeaderFields()
    );
  }, [item.headerFields, buildDefaultHeaderFields]);

  const syncAndSave = (
    fields: CustomHeaderField[],
    extra?: Partial<CustomItemType>
  ) => {
    const primaryTitle =
      fields?.[0]?.value?.toString().trim() ||
      item.title ||
      "未命名模块";

    onSave({
      ...item,
      ...extra,
      headerFields: fields,
      title: primaryTitle,
    });
  };

  const handleFieldUpdate = (id: string, patch: Partial<CustomHeaderField>) => {
    const next = headerFields.map((field) =>
      field.id === id ? { ...field, ...patch } : field
    );
    setHeaderFields(next);
    syncAndSave(next);
  };

  const handleFieldDelete = (id: string) => {
    const next = headerFields.filter((field) => field.id !== id);
    setHeaderFields(next);
    syncAndSave(next);
  };

  const handleAddField = () => {
    const newField: CustomHeaderField = {
      id: generateUUID(),
      label: "",
      value: "",
      align: "left",
      bold: false,
      fontSize: 14,
      icon: "User",
      showIcon: false,
      visible: true,
    };
    const next = [...headerFields, newField];
    setHeaderFields(next);
    syncAndSave(next);
  };

  const handleReorder = (items: CustomHeaderField[]) => {
    setHeaderFields(items);
    syncAndSave(items);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          标题行字段
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddField}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加字段
        </Button>
      </div>

      <Reorder.Group
        axis="y"
        values={headerFields}
        onReorder={handleReorder}
        className="space-y-3 max-h-[60vh] overflow-y-auto pr-1"
      >
        {headerFields.map((field) => (
          <Reorder.Item
            key={field.id}
            value={field}
            className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 bg-white dark:bg-neutral-900"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-neutral-400" />
              <IconSelector
                value={field.icon || "User"}
                onChange={(icon) =>
                  handleFieldUpdate(field.id, { icon })
                }
              />
              <Input
                value={field.label}
                onChange={(e) =>
                  handleFieldUpdate(field.id, { label: e.target.value })
                }
                placeholder="字段名"
                className="h-9 w-28"
              />
              <Input
                value={field.value}
                onChange={(e) =>
                  handleFieldUpdate(field.id, { value: e.target.value })
                }
                placeholder="字段内容"
                className="h-9 flex-1"
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 flex items-center justify-center"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 space-y-3" align="start">
                  <div className="space-y-2">
                    <span className="text-xs text-neutral-500">图标</span>
                    <IconSelector
                      value={field.icon || "User"}
                      onChange={(icon) =>
                        handleFieldUpdate(field.id, { icon })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">显示图标</span>
                    <Switch
                      checked={field.showIcon ?? false}
                      onCheckedChange={(checked) =>
                        handleFieldUpdate(field.id, { showIcon: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">加粗</span>
                    <Switch
                      checked={field.bold ?? false}
                      onCheckedChange={(checked) =>
                        handleFieldUpdate(field.id, { bold: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-neutral-500">字号</span>
                    <Input
                      type="number"
                      min={10}
                      max={32}
                      value={field.fontSize ?? 14}
                      onChange={(e) =>
                        handleFieldUpdate(field.id, {
                          fontSize: Number(e.target.value) || 14,
                        })
                      }
                      className="h-9 w-20"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-neutral-500">对齐</span>
                    <Select
                      value={field.align || "left"}
                      onValueChange={(value: "left" | "center" | "right") =>
                        handleFieldUpdate(field.id, { align: value })
                      }
                    >
                      <SelectTrigger className="h-9 w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">左</SelectItem>
                        <SelectItem value="center">中</SelectItem>
                        <SelectItem value="right">右</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">显示图标</span>
                    <Switch
                      checked={field.showIcon ?? false}
                      onCheckedChange={(checked) =>
                        handleFieldUpdate(field.id, { showIcon: checked })
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-neutral-500 hover:text-primary"
                onClick={() =>
                  handleFieldUpdate(field.id, { visible: !(field.visible ?? true) })
                }
              >
                {field.visible ?? true ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-red-500 hover:text-red-600"
                onClick={() => handleFieldDelete(field.id)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

const CustomItem = ({
  item,
  sectionId,
}: {
  item: CustomItemType;
  sectionId: string;
}) => {
  const { updateCustomItem, removeCustomItem, duplicateCustomItem } =
    useResumeStore();
  const dragControls = useDragControls();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleVisibilityToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isUpdating) return;

      setIsUpdating(true);
      setTimeout(() => {
        updateCustomItem(sectionId, item.id, { visible: !item.visible });
        setIsUpdating(false);
      }, 10);
    },
    [item, updateCustomItem, isUpdating, sectionId]
  );

  return (
    <Reorder.Item
      id={item.id}
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className={cn(
        "rounded-lg border overflow-hidden flex group",
        "bg-white hover:border-primary",
        "dark:bg-neutral-900/30",
        "border-gray-100 dark:border-neutral-800",
        "dark:hover:border-primary"
      )}
    >
      <div
        onPointerDown={(event) => {
          if (expandedId === item.id) return;
          dragControls.start(event);
        }}
        className={cn(
          "w-12 flex items-center justify-center border-r shrink-0 touch-none",
          "dark:border-neutral-800 border-gray-100",
          expandedId === item.id
            ? "cursor-not-allowed"
            : "cursor-grab hover:bg-gray-50 dark:hover:bg-neutral-800/50"
        )}
      >
        <GripVertical
          className={cn(
            "w-4 h-4",
            "dark:text-neutral-400 text-gray-400",
            expandedId === item.id && "opacity-50"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "px-4 py-4 flex items-center justify-between cursor-pointer select-none",
            expandedId === item.id && "dark:bg-neutral-800/50 bg-gray-50"
          )}
          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
        >
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium truncate text-gray-700",
                "dark:text-neutral-200"
              )}
            >
              {item.title || "未命名模块"}
            </h3>
            {item.subtitle && (
              <p
                className={cn(
                  "text-sm truncate",
                  "dark:text-neutral-400 text-gray-500"
                )}
              >
                {item.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              onClick={handleVisibilityToggle}
            >
              {item.visible ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-neutral-500 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                duplicateCustomItem(sectionId, item.id);
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-sm",
                "dark:hover:bg-red-900/50 dark:text-red-400 hover:bg-red-50 text-red-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <ThemeModal
              isOpen={deleteDialogOpen}
              title={item.title}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={() => {
                removeCustomItem(sectionId, item.id);
                setExpandedId(null);
                setDeleteDialogOpen(false);
              }}
            />

            <motion.div
              initial={false}
              animate={{
                rotate: expandedId === item.id ? 180 : 0,
              }}
            >
              <ChevronDown
                className={cn("w-5 h-5", "dark:text-neutral-400 text-gray-500")}
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expandedId === item.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "px-4 pb-4 space-y-4",
                  "dark:border-neutral-800 border-gray-100"
                )}
              >
                <div
                  className={cn(
                    "h-px w-full",
                    "dark:bg-neutral-800 bg-gray-100"
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      标题行字段
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditDialogOpen(true)}
                    >
                      编辑
                    </Button>
                  </div>
                  <div className="text-xs text-neutral-500 line-clamp-2">
                    {(item.headerFields && item.headerFields.length > 0
                      ? item.headerFields
                      : []
                    )
                      .map((f) => f.label || f.value)
                      .filter(Boolean)
                      .join(" · ") || "尚未添加字段"}
                  </div>
                </div>

                <Field
                  label="详细描述"
                  value={item.description}
                  onChange={(value) =>
                    updateCustomItem(sectionId, item.id, {
                      ...item,
                      description: value,
                    })
                  }
                  type="editor"
                  placeholder="请输入详细描述..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>标题行字段</DialogTitle>
          </DialogHeader>
          <CustomItemEditor
            item={item}
            onSave={(updatedItem) => updateCustomItem(sectionId, item.id, updatedItem)}
          />
          <DialogFooter>
            <Button onClick={() => setEditDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Reorder.Item>
  );
};

export default CustomItem;
