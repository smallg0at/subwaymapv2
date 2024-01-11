# Beijing Subway Map 北京地铁图

[English README file](https://github.com/smallg0at/subwaymapv2/blob/master/README_en.md)

使用 React + Next.js + MUI 编写的地铁图程序。包括完整的北京地铁数据。只有中文语言支持。

同时，支持 Android / Electron Build

在继续之前，不妨先试试：

[🔗 Vercel 托管（需要科学上网）](https://beijingsubwaymap.vercel.app/)

[🔗 GitHub Pages 托管](https://smallg0at.github.io/subwaymapv2/)

[🔗 Android / Windows 版](https://github.com/smallg0at/subwaymapv2/releases)


## 项目说明

这是用于北京工业大学《数据结构课设Ⅰ》「地铁售票与乘车引导系统」的作品。License 是一个修改版的 MIT 协议，这意味着：

- 你可以以任意方式修改此作品
- 你不能移除 License
- 如果你在相应的报告中使用了此作品的代码，请在致谢里给作者一个 Credit

主要代码在 `src/app` 中。如果想要更多的说明，请参见此文件下方内容。不妨找个翻译软件试试。

如果你不知道 Android Studio, Electron 是什么，就请忽略这些部分和文件夹，因为这些和主项目没什么关系。

关于数据：更新于2023年11月。虽然可能不是最新的，但是当时的完整数据，一定能满足要求并吓到你的老师。
如果想要自己实现外观的话，可以直接按以下说明从 `src/app` 拿数据。底图是[北京地铁官方网站上提供的图](https://www.bjsubway.com/jpg.html)，更新时请重采样至0.5x分辨率（约7k*6k），否则会因为 GPU 负担过大造成严重卡顿！

顺带一提，必须先安装 nodejs。

## 功能

- 非常友好的用户界面
- 黑暗模式
- 三种寻路选项： 最短、最快、最少换乘
- 旅行票据选项
- 移动友好

## Init

```bash
npm i
```

## 测试

运行开发服务器：

```bash
npm run dev
```

用浏览器打开 [http://localhost:35168](http://localhost:35168)，查看结果。

## 构建（Web）

⚠ 构建之前，先关掉开发服务器！ 


```bash
npm run build
启动
```

### 构建（安卓）

### 要求

Android Studio + Android SDK 33

### 使用方法

```bash
npm run build
npx cap sync
```

然后用以下命令启动 Android Studio

```
npx cap open android
```

### 构建（Electron）

### 设置

这需要一点时间

```
cd ./electron/
npm i
```

#### 构建

```
cd ./electron/
运行 electron:make
```

### 数据结构

所有数据存储在 `src/app/data` 中。

- `distanceData.json`： 地图边缘信息，用于寻路
- `nameList.json`： 可能的车站名称 + 景点输入字符串
- `stationIdList.json`: 索引 -> 车站名称列表。可能包含空值。
- `stationPos.json`： 站点在图像上的位置，用于绘制。
- `attractionData.json`：景点名称 -> 车站 ID 列表

注意：

- 每个站点的数字 ID 必须是唯一的，但可以不累计。
- 相互连接的车站应使用相同的 ID。
- 车站名称并不重要，因为寻路都不使用它，但您可以对其进行调整
- `./databench` 中的文件用于数据预处理，应用程序不会使用。

## 用于转换的工具

分散在 `databench/` 中。详情请阅读 `databench/conversion.cjs` 。

## 许可证

本项目使用修改后的 MIT 许可，并有以下限制：

- 当使用本软件的修改版编写报告时，必须在报告中注明上述作者姓名。

## 遥测

出于性能分析的原因，本程序将向 vercel 服务器发送匿名数据，以帮助作者进行一些优化。您可以从源代码中移除该模块，关闭遥测功能。

## 关于

这是一个使用[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)引导的[Next.js](https://nextjs.org/)项目。

数据最后更新于 2023 年 11 月。