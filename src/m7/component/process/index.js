/**
 * Created by XLBerry on 2019/5/15
 */
import Broadcast from "../../utils/Broadcast";

export default {
  showNotification: (args) => Broadcast.publish({
    channel: "M7_PROCESS",
    args,
    range: ["notice"]
  }),
  hideNotification: () => Broadcast.publish({
    channel: "M7_PROCESS",
    args: { type: null, title: null, className: null },
    range: ["notice"]
  }),
  showPicker: (args) => Broadcast.publish({
    channel: "M7_PROCESS",
    args: { ...args, show: true },
    range: ["picker"]
  }),
  hidePicker: () => Broadcast.publish({
    channel: "M7_PROCESS",
    args: { show: false },
    range: ["picker"]
  }),
  showToast: (args) => Broadcast.publish({
    channel: "M7_PROCESS",
    args: { ...args, show: true },
    range: ["loading"]
  }),
  hideToast: () => Broadcast.publish({
    channel: "M7_PROCESS",
    args: { show: false },
    range: ["loading"]
  }),
  showLoading: (args) => Broadcast.publish({
    channel: "M7_PROCESS",
    args: { ...args, show: true },
    range: ["loading"]
  }),
  hideLoading: () => Broadcast.publish({
    channel: "M7_PROCESS",
    args: { show: false },
    range: ["loading"]
  }),
  showModal: (args) => Broadcast.publish({
    channel: "M7_PROCESS",
    args: { ...args, show: true },
    range: ["modal"]
  }),
};