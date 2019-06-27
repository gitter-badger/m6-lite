// "use strict";

declare namespace M7NS {
  interface ElementProps {
    id?: string, // 组件标识
    className?: string, // 样式class
    style?: object, // 样式
    onClick?: () => void, // 点击事件
    subclass?: boolean, // 是否子类
  }

  interface ReProps {
    readonly path: string,
    exact?: boolean | false,
    title?: string,
  }

  /** 高阶装饰类 */
  class WrapComponent {
    setRef(name: string): object;

    getRef(name: string): object;

    setState(state?: object, callback?: () => any): Promise<any>;

    getState(): object;

    validate(callback?: () => any): Promise<any>;

    getDatasetProps(props?: object): object;
  }

  /** 网络请求方法 */
  enum RequestMethod {
    GET = "GET", POST = "POST"
  }

  /** 网络请求体内容格式 */
  enum RequestType {
    json = "json", file = "file"
  }

  /** 网络响应体内容格式 */
  enum ResponseType {
    json = "json", text = "text", file = "file"
  }

  /** 网络请求参数集 */
  interface RequestArgs {
    method?: RequestMethod,
    url: string,
    data: object,
    requestType: RequestType,
    responseType: ResponseType,
    headers?: object,
    timeout?: number,
    success?: () => void,
    fail?: () => void,
  }

  /** 网络请求函数返回实体 */
  interface RequestEntity {
    onProgress: (callback: (params: { current: number, total: number }) => any) => RequestEntity,
  }

  enum ButtonType {
    primary = "primary", default = "default", warn = "warn"
  }

  enum ButtonStatus {
    disabled = "disabled", loading = "loading"
  }

  interface ButtonProps extends ElementProps {
    type: ButtonType,
    status?: ButtonStatus,
  }

  interface InputProps extends ElementProps {
    type?: string,
    title?: any,
    onFocus?: () => any,
    onInput?: () => any,
    onBlur?: () => any,
    onChange?: (e: { readonly id: string, type: "input", data: string }) => any,
  }

  interface DatetimeProps extends ElementProps {
    title?: any,
    format?: string | "yyyy/MM/dd hh:mm:ss",
    onChange?: (e: { readonly id: string, type: "datetime", data: object }) => any,
  }

  /** 字典内容提供器 */
  interface DictDataFor {
    onReLoad: (args: { filter: string, superData: { code: string, detail: string }, from: number, total: number }) => Promise<{ total: number, list: [] }>,
    onLoad: (args: { filter: string, superData: { code: string, detail: string }, from: number, total: number }) => Promise<{ total: number, list: [] }>,
    hasNext: (data: { code: string, detail: string, others }) => Promise<boolean>,
  }

  interface DictProps extends ElementProps {
    title?: any,
    multiple?: boolean | false,
    cascade?: boolean | false, // 级联模式
    splitKey?: string | "，", // 字典detail切割符
    valueRender?: ({value, label}) => string, // 显示文字函数处理
    searchable?: boolean | false, // 搜索条
    onChange?: (e: { readonly id: string, type: "dict", data: [] }) => any,
    dataFor: DictDataFor, // 数据来源对象
  }

  interface ListProps extends ElementProps {
    itemRender: (data: object) => any,
    opts?: { canDown: boolean, canUp: boolean, distThreshold: number, scrollNodeCls: string }, // 上拉下拉配置
    onReLoad?: () => void | Promise<any>, // 顶部下拉，触发重置刷新
    onLoad?: () => void | Promise<any>, // 底部上推，触发加载更多
  }

  enum UploaderSourceType {
    album = "album", camera = "camera", both = "both"
  }

  interface UploaderProps extends ElementProps {
    title?: any,
    maxSize?: number | 8, // 最大个数
    sourceType?: UploaderSourceType | "both", // 图片来源，相册，相机，都有
    upload?: (args: { data: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }, success: (data) => void, fail: (error) => void }) => void, // 请求上传函数
    download?: (args: { data: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }, success: (data: { base64: string }) => void, fail: (error) => void }, callback) => void, // 加载显示函数（在file为空的情况下执行加载）
    autoDownload?: boolean | false, // 首次主动载入（在file-url无效的情况下执行加载）
    autoOriginal?: boolean | true, // 具备原图显示，在预览图片的时候，触发展示原图
    beforeUpload?: (item: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }) => void, // 上传图片前监听
    afterUpload?: (item: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }) => void, // 上传图片后监听
    beforeDownload?: (item: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }) => void, // 下载图片前监听
    afterDownload?: (item: { status: string, compressed: boolean, file: object, fileType: string, src: string, data: any }) => void, // 下载图片后监听
    onDelete?: (args: { id: string | null }) => void, // 删除图片监听
  }

  interface GalleryProps extends ElementProps {
    src?: string | null, // 图片
    hidden?: boolean | true, // 样式显示
    onHide?: () => void, // 隐藏
    onDelete?: () => void, // 删除
  }

  enum NotificationType {
    warn = "warn", info = "info"
  }

  enum LoadingIcon {
    loading = "loading", success = "success", info = "info", warn = "warn", waiting = "waiting"
  }
}

export default interface M7 {
  Re(props: M7NS.ReProps): () => any,

  navigate(args: {
    url?: string,
    state?: object,
    reLaunch?: boolean,
    redirect?: boolean,
    delta?: number,
    outer?: boolean,
  }): void,

  create(opts: {
    type?: string | "view",
    cache?: boolean | true,
    namespace?: string,
    className?: string | "m7-page",
  }): () => M7NS.WrapComponent,

  boost(delay?: number | 300): () => any,

  request(args: M7NS.RequestArgs): M7NS.RequestEntity,

  requestAsync(args: M7NS.RequestArgs): Promise<M7NS.RequestEntity>,

  Button(props: M7NS.ButtonProps): () => any,

  Input(props: M7NS.InputProps): () => any,

  Datetime(props: M7NS.DatetimeProps): () => any,

  Dict(props: M7NS.DictProps): () => any,

  List(props: M7NS.ListProps): () => any,

  Uploader(props: M7NS.UploaderProps): () => any,

  Gallery(props: M7NS.GalleryProps): () => any,

  showNotification(args: { title: string, className?: string, type: M7NS.NotificationType, duration?: number }): void,

  hideNotification(): void,

  showPicker(args: { content: any, contentCls?: string, cancelText?: string, fail?: () => void, confirmText: string, success?: () => void, miss?: () => void }): void,

  hidePicker(): void,

  showToast(args: { mask?: boolean | true, title: string, icon?: M7NS.LoadingIcon | null, duration?: number, complete?: () => void }): void,

  hideToast(): void,

  showLoading(args: { mask?: boolean | true, title: string, icon?: M7NS.LoadingIcon | null, duration?: number, complete?: () => void }): void,

  hideLoading(): void,

  showModal(args: { title?: string, content: any, cancelText?: string, cancelColor?: string, confirmText?: string, confirmColor?: string }): void,
}