import classNames from "classnames"
import { useRef, useState } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)
  const [isChecked, setIsChecked] = useState(checked);

  const handleOnChange = (newValue: boolean) => {
    setIsChecked(newValue);
    onChange(newValue);
  };


  return (
    <div className="RampInputCheckbox--container" data-testid={inputId} onClick={() => handleOnChange(!isChecked)}>
      <label
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": isChecked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
      />
      {/* <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={isChecked}
        disabled={disabled}
        onChange={() => handleOnChange(!isChecked)}
        onClick={() => {console.log("hello")}}
      /> */}
    </div>
  )
}
