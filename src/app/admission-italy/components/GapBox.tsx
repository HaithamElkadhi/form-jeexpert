"use client";

import type { GapDocType } from "../types";
import { GAP_DOC_TYPE_OPTIONS } from "../options";
import {
  hintClass,
  inputClass,
  labelClass,
  pillActiveClass,
  pillClass,
  pillIdleClass,
  warningBoxClass,
} from "./fieldStyles";

interface Props {
  gapYears: number;
  gapDescription: string;
  gapDocTypes: GapDocType[];
  onDescriptionChange: (value: string) => void;
  onDocTypesChange: (types: GapDocType[]) => void;
}

export default function GapBox({
  gapYears,
  gapDescription,
  gapDocTypes,
  onDescriptionChange,
  onDocTypesChange,
}: Props) {
  function toggleType(type: GapDocType) {
    if (type === "No document") {
      onDocTypesChange(gapDocTypes.includes("No document") ? [] : ["No document"]);
      return;
    }

    const withoutNo = gapDocTypes.filter((t) => t !== "No document");
    if (withoutNo.includes(type)) {
      onDocTypesChange(withoutNo.filter((t) => t !== type));
    } else {
      onDocTypesChange([...withoutNo, type]);
    }
  }

  return (
    <div className={warningBoxClass}>
      <h3 className="font-medium text-italy-terracotta-dark">
        Gap of {gapYears} year{gapYears === 1 ? "" : "s"} detected — please explain
      </h3>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="gapDescription">
          What did you do during this period?
        </label>
        <textarea
          id="gapDescription"
          rows={4}
          className={inputClass}
          placeholder="Describe your activities: personal projects, volunteering, travel, family reasons, job search…"
          value={gapDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className={labelClass}>Documents to justify this period (select all that apply)</p>
        <div className="flex flex-wrap gap-2">
          {GAP_DOC_TYPE_OPTIONS.map((type) => {
            const selected = gapDocTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`${pillClass} ${selected ? pillActiveClass : pillIdleClass}`}
              >
                {type}
              </button>
            );
          })}
        </div>
        <p className={hintClass}>
          Selecting &quot;No document&quot; clears other choices. Each selected type adds an upload
          slot in step 3.
        </p>
      </div>
    </div>
  );
}
