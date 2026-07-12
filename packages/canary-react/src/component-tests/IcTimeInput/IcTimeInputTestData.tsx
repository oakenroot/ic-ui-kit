import React, { useState } from "react";
import { IcTimeInput } from "../../components";
import { IcTypography, IcLink, IcButton } from "@ukic/react";

export const DefaultTimeInput = (
  timeInputProps?: Partial<React.ComponentProps<typeof IcTimeInput>>
) => {
  return (
    <IcTimeInput
      label="What time would you like to collect your coffee?"
      {...timeInputProps}
    />
  );
};

export const CustomHelperTextTimeInput = () => {
  return (
    <>
      <IcTimeInput
        label="What time would you like to collect your coffee?"
        helperText="Please select a time that works for you."
      />
      <br />
      <IcTimeInput label="What time would you like to collect your coffee?">
        <IcTypography variant="caption" slot="helper-text">
          <span>
            For special requests,
            <IcLink href="#">contact us</IcLink> before choosing a time
          </span>
        </IcTypography>
      </IcTimeInput>
    </>
  );
};

export const ValidationStatusTimeInput = () => {
  return (
    <>
      <IcTimeInput
        label="What time would you like to collect your coffee?"
        validationStatus="error"
        validationText="There is no coffee. Please choose a different time."
      />
      <br />
      <IcTimeInput
        label="What time would you like to collect your coffee?"
        validationStatus="warning"
        validationText="There may be a coffee shortage at that time."
      />
      <br />
      <IcTimeInput
        label="What time would you like to collect your coffee?"
        validationStatus="success"
        validationText="Your coffee will be available at this time."
      />
    </>
  );
};

export const DisableTimesTimeInput = () => {
  // Bare time strings are not part of IcDisableTimeSelection and are
  // ignored at runtime, so only start/end ranges are passed
  return (
    <DefaultTimeInput disableTimes={[{ start: "08:00:00", end: "10:00:00" }]} />
  );
};

export const ClearingValueTimeInput = () => {
  const [value, setValue] = useState<string>("08:30:00");
  const handleUpdate = () => {
    setValue("08:30:00");
  };
  const handleClearValue = (value: string | null | undefined) => {
    setValue(value);
  };
  return (
    <>
      <IcTimeInput
        label="When would you like to collect your coffee?"
        value={value}
      />
      <br />
      <div style={{ display: "flex", gap: "8px" }}>
        <IcButton onClick={() => handleUpdate()}>Update time</IcButton>
        <IcButton id="update-null" onClick={() => handleClearValue(null)}>
          Set null
        </IcButton>
        <IcButton id="update-empty" onClick={() => handleClearValue("")}>
          Set Empty String
        </IcButton>
        <IcButton
          id="update-undefined"
          onClick={() => handleClearValue(undefined)}
        >
          Set undefined
        </IcButton>
      </div>
    </>
  );
};
