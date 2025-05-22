import React from "react";
import ThreeDSelect from "../../../ui/3dSelect/3dSelect";
import { useLocalStorage } from "@mantine/hooks";

const CollegeSelect: React.FC = () => {
  const [selectedCollege, setSelectedCollege] = useLocalStorage({
    key: "college",
    defaultValue: "",
  });

  return (
    <ThreeDSelect
      options={[
        { label: "Harvard University", value: "harvard_university" },
        { label: "Stanford University", value: "stanford_university" },
        {
          label: "Massachusetts Institute of Technology",
          value: "mit",
        },
        {
          label: "University of California, Berkeley",
          value: "uc_berkeley",
        },
        {
          label: "Princeton University",
          value: "princeton_university",
        },
      ]}
      placeholder="Select Your College"
      onChange={(val) => {
        if (typeof val === "string") setSelectedCollege(val);
      }}
      value={selectedCollege}
    />
  );
};

export default CollegeSelect;
