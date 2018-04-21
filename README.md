# Tranquilpeak

一个个性化的Tranquilpeak hexo主题，原主题 https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak

[![Tranquilpeak](http://d1u9biwaxjngwg.cloudfront.net/showcases/showcase-v1.10.jpg)](https://github.com/cherlas/hexo-theme-tranquilpeak)

[Demo](www.istarx.cc)

修改的地方：

1. 添加全屏首页；
2. 重新设计了目录显示，可以随滚动悬停；
3. 重新设计了搜索栏；
4. 添加了自定义内容：
   - 通过设置 post 的`coverHeight`值改变post head cover image 的高度；
   - 通过设置 post 的`blur`值改变header cover image 的模糊程度；
   - toc显示位置
       - true：宽度小于982px时，显示在博客内容的上面，大于982px时在博客内容右侧，可以悬停；
       - false：显示在博客内容的上面； 
5. 添加版权模版；
6. 添加加载动画；
7. 可以设置是否自动排列image的位置：`_config.yml`中的`auto_thumbnail_image_position`；
8. etc...

## 版本要求

Node: v4+
Hexo: 3.0.0+

## 开始 ##

### 安装

在hexo跟目录下执行以下命令:

``` bash
$ git clone https://github.com/cherlas/hexo-theme-tranquilpeak.git themes/tranquilpeak
```

修改 hexo根目录的配置文件 `_config.yml` 中的 `theme` 属性为 `tranquilpeak`.

### 更新

``` bash
cd themes/tranquilpeak
git pull
```

请阅读大神[Louis Barranqueiro](https://github.com/LouisBarranqueiro)的[文档](https://github.com/cherlas/hexo-theme-tranquilpeak/blob/master/docs/user.md), 写的很详细

### 个性化文章

#### 目录

为了达到定制化的需求，使用 `markdown-it-toc-and-anchor`插件生成目录，并在 Front Matter部分添加了`toc`参数：

```yaml
toc: true
# toc: false
```

- `false`: 在 toc 设置为false时，如果在文章中有`@[toc]` 标记时，会将`@[toc]`标记替换为当前文章的目录，并且一直停留在文章的最上方，如果没有该标志，则不会生成目录；
- `true`:  toc 为 true 时，如果在文章中有`@[toc]` 标记时，会将`@[toc]`标记替换为当前文章的目录，在文章的右上角位置，并且随鼠标滚动可以悬停；

如果要使用悬停，则需要在在 hexo 配置文件中添加如下配置内容：

```yaml
markdown_it_plus:
	...
    plugins:
        - plugin:
            name: markdown-it-toc-and-anchor
            enable: true
            options:
              tocClassName: 'toc js-fixedContent'
              anchorClassName: 'anchor'
```

如果要修改 `tocClassName`值，则需要同步修改`source/_js/fix-content.js`文件中的以下语句

```js
this.$jsFixedContent = $('.toc.js-fixedContent');
```

### wide-image

原主题中提供了 wide-image 功能，在个性化主题中为了添加文章目录悬停，现在的wide-image只能填充博客文章内容所在区域，而不能填充到整个页面宽度

### 文章页面顶部的图片

在 Front Matter 区域添加了两个参数：

```yaml
coverHeight: 60%
blur: 0
```

- coverHeight 指背景图片所占页面高度的百分比，**一定要带上`%`**；
- blur 指背景图片的模糊程度，改变该值可以对背景图片进行不同程度的模糊；

### 搜索栏配置

搜索是基于 `algolia`, 为保证能正常使用搜索，请按照步骤正确配置`algolia`。
配置方法：https://github.com/cherlas/hexo-theme-tranquilpeak/blob/master/docs/user.md#algolia
并且在`field`中添加`path`、`permalink`二者之一或者二者皆有：
```yaml
algolia:
  appId: "Z7A3XW4R2I"
  apiKey: "12db1ad54372045549ef465881c17e743"
  adminApiKey: "40321c7c207e7f73b63a19aa24c4761b"
  indexName: "blog-index"
  ...
  fields:
    - path
    - permalink
    ...
```

## License ##

hexo-theme-tranquilpeak 采用 [GNU General Public License v3.0](https://github.com/cherlas/hexo-theme-tranquilpeak/blob/master/LICENSE)协议
