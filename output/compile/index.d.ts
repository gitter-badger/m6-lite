// "use strict";

declare namespace M7NS {

  abstract class ReactComponent {
    render(): any;
  }

  /** 基础类属性和方法 */
  interface Component {
    id: string; // 组件标识
    subclass?: boolean; // 是否子类
    className?: string; // 样式class
    style?: object; // 样式
    onClick?: () => void; // 点击事件
    [propName: string]: any; // 其他
  }

  /** 高阶装饰类 */
  interface WrapComponent extends Component {
    setRef(name: string): object;

    getRef(name: string): object;

    setState(state?: object, callback?: () => any): Promise<any>;

    getState(): object;

    validate(callback?: () => any): Promise<any>;

    onValidate(rs: boolean | string): void;

    getDatasetProps(props?: object): object;
  }

  interface ReProps {
    readonly path: string;
    exact?: true;
    title?: string; // 当前地址标题
    readonly component: any;
  }

  /** 网络请求参数集 */
  interface RequestArgs {
    method?: "GET" | "POST"; // 网络请求方法
    url: string;
    data: object;
    requestType: "json" | "file"; // 网络请求体内容格式
    responseType: "json" | "text" | "file"; // 网络响应体内容格式
    headers?: object;
    timeout?: number;
    success?: () => void;
    fail?: () => void;
  }

  /** 网络请求函数返回实体 */
  interface RequestEntity {
    onProgress: (callback: (params: { current: number, total: number }) => any) => RequestEntity;
  }

  interface ButtonProps extends Component {
    type: "primary" | "default" | "warn";
    status?: "disabled" | "loading";
  }

  interface InputProps extends Component {
    type?: string;
    title?: any;
    onFocus?: () => any;
    onInput?: () => any;
    onBlur?: () => any;
    onChange?: (e: { readonly id: string, type: "input", data: string }) => any;
  }

  interface DatetimeProps extends Component {
    title?: any;
    format?: "yyyy/MM/dd hh:mm:ss" | "yyyy/MM/dd" | "hh:mm:ss" | "hh:mm";
    onChange?: (e: { readonly id: string, type: "datetime", data: object }) => any;
  }

  /** 字典内容提供器 */
  interface DictDataFor {
    onReLoad: (args: { filter: string, superData: { code: string, detail: string }, from: number, total: number }) => Promise<{ total: number, list: [] }>;
    onLoad: (args: { filter: string, superData: { code: string, detail: string }, from: number, total: number }) => Promise<{ total: number, list: [] }>;
    hasNext: (data: { readonly code: string, readonly detail: string, readonly [propName: string]: any }) => Promise<boolean>;
  }

  interface DictProps extends Component {
    title?: any;
    multiple?: false;
    cascade?: false; // 级联模式
    splitKey?: "，"; // 字典detail切割符
    valueRender?: ({value, label}) => string; // 显示文字函数处理
    searchable?: false; // 搜索条
    onChange?: (e: { readonly id: string, type: "dict", data: [] }) => any;
    dataFor: DictDataFor; // 数据来源对象
  }

  interface ListProps extends Component {
    itemRender: (data: object) => ReactComponent;
    opts?: { canDown: boolean, canUp: boolean, distThreshold: number, scrollNodeCls: string }; // 上拉下拉配置
    onReLoad?: () => Promise<any>; // 顶部下拉，触发重置刷新
    onLoad?: () => Promise<any>; // 底部上推，触发加载更多
  }

  interface UploaderProps extends Component {
    title?: any;
    maxSize?: 8; // 最大个数
    sourceType?: "album" | "camera" | "both"; // 图片来源，相册，相机，都有
    upload?: (
      args: {
        data: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any },
        success: (data) => void,
        fail: (error) => void
      }
    ) => void; // 请求上传函数
    download?: (
      args: {
        data: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any },
        success: (data: { base64: string }) => void,
        fail: (error) => void
      },
      callback
    ) => void; // 加载显示函数（在file为空的情况下执行加载）
    autoDownload?: false; // 首次主动载入（在file-url无效的情况下执行加载）
    autoOriginal?: true; // 具备原图显示，在预览图片的时候，触发展示原图
    beforeUpload?: (item: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }) => void; // 上传图片前监听
    afterUpload?: (item: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }) => void; // 上传图片后监听
    beforeDownload?: (item: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }) => void; // 下载图片前监听
    afterDownload?: (item: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }) => void; // 下载图片后监听
    onDelete?: (args: { id: null }) => void; // 删除图片监听
  }

  interface GalleryProps extends Component {
    src?: string | null; // 图片
    hidden?: true; // 样式显示
    onHide?: () => void; // 隐藏
    onDelete?: () => void; // 删除
  }

  type ProcessIcon = "loading" | "success" | "info" | "warn" | "waiting";
}

interface M7Static {

  navigate(args: {
    url?: string,
    state?: object,
    reLaunch?: boolean,
    redirect?: boolean,
    delta?: number,
    outer?: boolean,
  }): void;

  create(opts: {
    type?: "view" | "element" | null,
    cache?: true,
    namespace?: string,
    className?: "m7-page",
  }): (target: M7NS.ReactComponent) => M7NS.WrapComponent;

  boost(delay?: 300): () => any;

  Re(props: M7NS.ReProps): () => M7NS.ReactComponent;

  Button(props: M7NS.ButtonProps): () => M7NS.ReactComponent;

  Input(props: M7NS.InputProps): () => M7NS.ReactComponent;

  Datetime(props: M7NS.DatetimeProps): () => M7NS.ReactComponent;

  Dict(props: M7NS.DictProps): () => M7NS.ReactComponent;

  List(props: M7NS.ListProps): () => M7NS.ReactComponent;

  Uploader(props: M7NS.UploaderProps): () => M7NS.ReactComponent;

  Gallery(props: M7NS.GalleryProps): () => M7NS.ReactComponent;

  request(args: M7NS.RequestArgs): M7NS.RequestEntity;

  requestAsync<T extends M7NS.RequestArgs>(args: T): Promise<M7NS.RequestEntity>;

  showNotification(args: { title: string, className?: string, type: "warn" | "info", duration?: number }): void;

  hideNotification(): void;

  showPicker(args: { content: any, contentCls?: string, cancelText?: string, fail?: () => void, confirmText: string, success?: () => void, miss?: () => void }): void;

  hidePicker(): void;

  showToast(args: { mask?: true, title: string, icon?: M7NS.ProcessIcon, duration?: number, complete?: () => void }): void;

  hideToast(): void;

  showLoading(args: { mask?: true, title: string, icon?: M7NS.ProcessIcon, duration?: number, complete?: () => void }): void;

  hideLoading(): void;

  showModal(args: { title?: string, content: any, cancelText?: string, cancelColor?: string, confirmText?: string, confirmColor?: string }): void;
}

declare const M7: M7Static;
export default M7;