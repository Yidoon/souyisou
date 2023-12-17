import { Input, Form, Switch, Button, Collapse } from "antd";
import LogoSvg from "../components/LogoSvg";
import "./app.css";
import type { CollapseProps } from "antd";
import { PopupContext } from "./store";
import { useContext, useEffect, useState } from "react";
import { BasicSettingsForm, OpenAIModelSelector } from "../components/Settings";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { CaiyunFormData, OpenAIFormData } from "../types";
import { KEY_BASIC_SETTINGS } from "../constants";
import { EVENT_TOGGLE_ENABLE_SWITCH } from "../eventsType";

const OpenAIForm = () => {
  const { platformSettings, setPlatformSettings } = useContext(PopupContext);

  const handleFieldsChange = (changedValue: any) => {
    setPlatformSettings((originValue) => ({
      ...originValue,
      openai: {
        ...(originValue.openai || {}),
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

const CaiyunForm = () => {
  const { platformSettings, setPlatformSettings } = useContext(PopupContext);
  const handleFieldsChange = (changedValue: any) => {
    setPlatformSettings((originValue) => ({
      ...originValue,
      caiyun: {
        ...(originValue.caiyun || {}),
        [changedValue[0].name]: changedValue[0].value,
      },
    }));
  };

  return (
    <Form<CaiyunFormData>
      size="small"
      onFieldsChange={handleFieldsChange}
      initialValues={platformSettings.caiyun}
    >
      <Form.Item
        label="Token"
        name="token"
        className="mb-2"
        rules={[{ required: true }]}
      >
        <Input.Password placeholder="" />
      </Form.Item>
    </Form>
  );
};

export default function App() {
  const { basicSettings, setBasicSettings } = useContext(PopupContext);

  const [enable, setEnable] = useState<boolean>(!!basicSettings?.enable);

  const items: CollapseProps["items"] = [
    {
      key: "openai",
      label: "OpenAI",
      children: <OpenAIForm />,
    },
    {
      key: "caiyun",
      label: "彩云",
      children: <CaiyunForm />,
    },
  ];
  const handleSwitchChange = async (checked: boolean) => {
    setEnable(checked);
    setBasicSettings((originValue) => ({ ...originValue, enable: checked }));

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, {
        type: EVENT_TOGGLE_ENABLE_SWITCH,
        data: checked,
      });
    });
  };

  useEffect(() => {
    setEnable(basicSettings?.enable as boolean);
  }, []);

  return (
    <div className="w-[400px] flex flex-col justify-between">
      <div className="flex items-center w-[400px] py-4 px-2 gap-2 border-b-[1px] border-[#eee]">
        <LogoSvg />
        <div className="flex items-center gap-2">
          <span className="text-md font-black">搜译搜</span>
          <a href="https://github.com/Yidoon/souyisou" target="_blank">
            0.1.0
          </a>
        </div>
      </div>

      <div className="px-2">
        <span>基本设置</span>
        <BasicSettingsForm />
      </div>

      <div className="px-2 mb-[68px] mt-4">
        <span className="flex items-center gap-1">
          平台设置
          <QuestionCircleOutlined title="所有设置将会存在在浏览器本地，请放心使用" />
        </span>
        <div className="mt-2 ml-3">
          <Collapse items={items} />
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 w-full flex justify-between px-4 py-2 box-border"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="flex items-center gap-1">
          <Switch onChange={handleSwitchChange} checked={enable} />
        </div>
        <div>
          <a
            className="pr-0"
            target="_blank"
            href="https://github.com/Yidoon/souyisou/issues"
          >
            提交反馈
          </a>
        </div>
      </div>
    </div>
  );
}
