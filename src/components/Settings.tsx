import { Form, SelectProps, Select, Input } from "antd";
import { BasicSettings, PopupContext } from "../popup/store";
import { useContext, useEffect, useState } from "react";
import { languages, platforms } from "../constants";
import { useRecordHotkeys } from "react-hotkeys-hook";

const Option = Select.Option;

export function BasicSettingsForm() {
  const { basicSettings, setBasicSettings } = useContext(PopupContext);
  const handleFieldsChange = (changedValue: any) => {
    setBasicSettings((originValue) => ({
      ...originValue,
      [changedValue[0].name]: changedValue[0].value,
    }));
  };

  return (
    <Form<BasicSettings>
      layout="vertical"
      className="p-2 ml-3"
      onFieldsChange={handleFieldsChange}
      initialValues={basicSettings}
    >
      <Form.Item className="mb-2" label="选择目标语言" name="targetLanguage">
        <TargetLangSelector />
      </Form.Item>

      <Form.Item className="mb-2" label="设置快捷键" name="hotKey">
        <HotKeyRecorder />
      </Form.Item>

      <Form.Item className="mb-2" label="选择翻译平台" name="platform">
        <PlatformSelector />
      </Form.Item>
    </Form>
  );
}

interface APIModelOption {
  label: string;
  id: string;
}
export function OpenAIModelSelector(props: SelectProps) {
  const openAIModelOptions: APIModelOption[] = [
    { label: "gpt-3.5-turbo", id: "gpt-3.5-turbo" },
    { label: "gpt-3.5-turbo-0613", id: "gpt-3.5-turbo-0613" },
    { label: "gpt-3.5-turbo-0301", id: "gpt-3.5-turbo-0301" },
    { label: "gpt-3.5-turbo-16k", id: "gpt-3.5-turbo-16k" },
    { label: "gpt-3.5-turbo-16k-0613", id: "gpt-3.5-turbo-16k-0613" },
    { label: "gpt-4", id: "gpt-4" },
    { label: "gpt-4-0314", id: "gpt-4-0314" },
    { label: "gpt-4-0613", id: "gpt-4-0613" },
    { label: "gpt-4-32k", id: "gpt-4-32k" },
    { label: "gpt-4-32k-0314", id: "gpt-4-32k-0314" },
    { label: "gpt-4-32k-0613", id: "gpt-4-32k-0613" },
  ];
  return (
    <Select placeholder="请选择 Model" {...props}>
      {openAIModelOptions.map((option) => (
        <Option key={option.id} value={option.id}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
}

export function PlatformSelector(props: SelectProps) {
  const [selectablePlatforms, setSelectablePlatforms] = useState<string[]>([]);

  const { platformSettings } = useContext(PopupContext);

  const init = async () => {
    setSelectablePlatforms(
      platforms
        .filter((p) => !!platformSettings?.[p.value])
        .map((platform) => platform.value)
    );
  };

  useEffect(() => {
    init();
  }, [platformSettings]);

  return (
    <Select placeholder="请选择平台" {...props}>
      {platforms.map((option) => {
        const disable = !selectablePlatforms.includes(option.value);
        return (
          <Option key={option.value} value={option.value} disabled={disable}>
            {option.name}
            {disable && `(设置账号后才能使用)`}
          </Option>
        );
      })}
    </Select>
  );
}

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}
export function HotKeyRecorder(props: Props) {
  const { value, onChange } = props;

  const [keys, { start, stop, isRecording }] = useRecordHotkeys();

  useEffect(() => {
    onChange?.(Array.from(keys).join(" + ") || value || "");
  }, [keys, value]);

  return (
    <div>
      <Input onFocus={() => start()} value={value} onBlur={() => stop()} />
      <span className="text-black text-opacity-60">
        {isRecording ? "请按你要设置的快捷键" : "点击上方设置快捷键"}
      </span>
    </div>
  );
}

export function TargetLangSelector(props: SelectProps) {

  return (
    <Select placeholder="请选择目标语言" {...props}>
      {languages.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
}
