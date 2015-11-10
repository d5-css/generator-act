# generator-act 

> [Yeoman](http://yeoman.io) generator


## 安装

```
npm i -g yo bower generator-act
npm i -g scrat scrat-preprocessor-i18n fis-prepackager-browserify
```

## 使用

### 生成项目

```
mkdir my-project
cd my-project
yo act
```

### 生成页面文件

```
yo act:view <viewName>
```

其中 `viewName` 为页面名

### 定义配置

```
yo act:config <configKey> [configValue]
```

其中 `configKey` 为配置名，`configValue` 为配置值。


### 生成组件文件

```
yo act:cmp new <componentName>
```

或者可以简写为

```
yo act:cmp n <componentName>
```

### 安装组件

```
yo act:cmp install <componentName>
```

或者可以简写为

```
yo act:cmp i <componentName>
```

### 生成国际化配置文件

```
yo act:i18n <language>
```

其中 `language` 为语言名称，如 `en`，`ru` 等

## License

MIT
