import { Input, Form, Switch, Button, Collapse } from "antd";
import LogoSvg from "../components/LogoSvg";
import "./app.css";
import type { CollapseProps } from "antd";
import { OpenAIFormData, PopupContext } from "./store";
import { useContext } from "react";
import { BasicSettingsForm, OpenAIModelSelector } from "../components/Settings";
import { QuestionCircleOutlined } from "@ant-design/icons";

const OpenAIForm = () => {
  const { platformSettings, setPlatformSettings } = useContext(PopupContext);

  const handleFieldsChange = (changedValue: any) => {
    setPlatformSettings((originValue) => ({
      ...originValue,
      openai: {
        ...originValue.openai,
        [changedValue[0].name]: changedValue[0].value,
      },
    }));
  };

  return (
    <Form<OpenAIFormData>
      size="small"
      onFieldsChange={handleFieldsChange}
      initialValues={platformSettings.openai}
    >
      <Form.Item
        label="API Key"
        name="apiKey"
        className="mb-2"
        rules={[{ required: true }]}
      >
        <Input.Password placeholder="sk-xxxx" />
      </Form.Item>

      <Form.Item
        label="API Model"
        name="apiModel"
        className="mb-2"
        rules={[{ required: true }]}
      >
        <OpenAIModelSelector />
      </Form.Item>
    </Form>
  );
};

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and
    faithfulness, it can be found as a welcome guest in many households across
    the world.
  </p>
);
export default function App() {
  const items: CollapseProps["items"] = [
    {
      key: "openai",
      label: "OpenAI",
      children: <OpenAIForm />,
    },
    {
      key: "youdao",
      label: "有道",
      children: text,
    },
    {
      key: "caiyun",
      label: "彩云",
      children: text,
    },
  ];

  return (
    <div className="w-[400px] flex flex-col justify-between">
      <div className="flex items-center w-[400px] py-4 px-2 gap-2 border-b-[1px] border-[#eee]">
        <LogoSvg />
        <span className="text-md font-black">搜译搜</span>
      </div>

      <div className="px-2">
        <span>基本设置</span>
        <BasicSettingsForm />
      </div>

      <div className="px-2 mb-[68px] mt-4">
        <span>
          平台设置{" "}
          <QuestionCircleOutlined title="所有设置将会存在在浏览器本地，请放心使用" />
        </span>
        <div className="mt-2 ml-3">
          <Collapse items={items} defaultActiveKey={["openai"]} />
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 w-full flex justify-between px-4 py-2 box-border"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="flex items-center gap-1">
          <Switch />
        </div>
        <div>
          <Button className="pr-0" type="link">
            提交反馈
          </Button>
        </div>
      </div>
    </div>
  );
}
