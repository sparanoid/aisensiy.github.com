---
layout:     post
title:      "REST vs GraphQL"
date:       2021-02-20 19:36:00 +08:00
author:     "Eisen"
tags:       [web, rest, graphql]
---

考虑到目前 REST API 层和前端对接起来不是那么顺滑，于是有去找解决方案了，找来找去感觉也就是切 GraphQL 了，这次又来看 GraphQL 感觉它比上次看要香了。好好总觉了一些东西出来。

## 为什么之前对 GraphQL 不感兴趣

之前有注意到 GraphQL，毕竟也都好几年了呢，但当时一方面是没有对它有比较充分的理解，没有真切的感受到它的好处，另一方面是其存在诸多对于 REST 的一些误解。

### 认为 REST 的资源是独立的

![](https://images-1300693298.cos.ap-beijing.myqcloud.com/20210216231615.png)

这是我从一个介绍 GraphQL 的材料里找到的例子，例子中提到如果用户想要获取一个 book 列表，每个 book 中还要包含 author 的信息，就很容易出现 N+1 个请求的问题，效率非常低下。如果这也是为什么要有 GraphQL 的原因之一的话，那其实没必要有 GraphQL...

REST 也没有这么死板吧。实际上在返回的每一个 book 中包含 author 信息是非常自然的事情：

```
GET /books

{
  "data": [
    {
      "id": "1",
      "title": "how to graphql",
      "description": "bla",
      "author": {
        "id": "x",
        "name": "abc",
        "avatar": "http://avatar.com"
      }
    }
    ...
  ]
}
```

自我一篇很古老的[文章](/some-tips-for-ddd)里就提到了，`GET` 请求获取的是「读模型」，应该按照调用方的需求合理的展示相关的数据，以方便调用方的使用。如果像这里说的方法就是大家使用 REST 的方式的话，我觉得前端早就疯了。实际上，这种灵活的聚合展示早就是家常便饭了呢，当然，从标准化的角度来说，这却是也是一个巨大的问题。

### 过度担忧 overfetching

[TolerantReader](https://martinfowler.com/bliki/TolerantReader.html) 有提到，如果你对于一个请求只关心其一部分信息，那就只处理那部分就好，至于其他的字段，请自行忽略。对于这些额外的字段所带来的额外的数据其实是完全不需要担心的：

1. REST 请求所获取的资源通常都是区分 data 和 data-item 的。
   - data 是一个全量的信息，比如上午提到的一个完整的 book 信息，包含其详细的描述、目录、甚至热门评论，其所拥有的具体字段完全是和调用方探讨确认的，通常用于详情页面的展示
   - data-item 通常是一个资源的 summary 通常用于列表的展示
   
   这两种类型的区分本来就考虑了 overfetching 的问题：有些字段字段获取成本比较高，在列表里获取很容易产生 N+1 的问题，因此就只在 data 中出现，而不会出现在 data-item 中。在有了这个原则之后，额外那些字段其实不会对性能有什么非常大的影响。
2. 每次返回的结构一致更容易做缓存，一次获取长期拥有，其实没那么大成本

## 目前 REST 的一些问题

不过 REST 也不是没有问题，在 [REST 的一些实践心得](/rest-practice) 也做了一些吐槽。总结来说就是这么几点：

1. 也有类似于 [jsonapi](https://jsonapi.org/) 的东西出现，但不算公认的标准，也没有形成什么很好的支持
2. 没有大厂支持，依靠社区进展比较缓慢，OpenAPI 的众多工具都有奇奇怪怪的小问题
3. 对 websocket 没有很好的支持
4. 没有考虑 HATEOAS 的弊端，这里我直接意译 [A REST View of GraphQL](https://hasura.io/blog/rest-view-of-graphql/) 的观点，讲的太好了：

  > HATEOAS 在用户是最终用户的时候比较有意义，可以支持用户像是在浏览器里面做探索，每个页面有链接指引用户。即使页面发生了变化，只要链接都在就能够支持用户。

  > 可惜对于 API Client 来说，只需要一次性去调用具体某一个接口的，如果每次都从根源去探索 API 效率是非常低下的。这种情况下类似于 OpenAPI 所生成的 SDK 是更方便的。

  > 从目前的交互模式来看，前端就是这么一个 API Client 而已，HATEOAS 对其并没有什么意义。任何 API schema 的修改都可能导致 API Client 的崩溃。


## 采用 GraphQL 的一些好处

1. Graph 的 metal model 非常适合做「读」模型的标准化
2. 强大的生态，首先是 facebook 提出的，后面相当多的公司都有跟进（Github、Airbnb、Netflix）
3. 工具链比较健全：
   1. GraphiQL, GraphQL Playground 这样类似于 postman 的测试调用工具
   2. Apollo 这样做前后端继承框架开发的公司，在前后端都做的不错
   3. 对微服务的支持，[Apollo Federation](https://www.apollographql.com/docs/federation/federation-spec/) 
   4. [schema-registry](https://github.com/pipedrive/graphql-schema-registry) 甚至有这种 schema 变更追溯的东西，REST 这边想都不敢想
4. 有 `subscription` 的概念，将长链接的情况也考虑在内了


整体来说，我觉得 GraphQL 是一个工具更健全，规范更完善，生命力更持久的体系。却是克服了 rest 中的一些问题，后面会开始尝试用 GraphQL 对原有 API 做一层封装看看效果。

## 参考资料

1. [A REST View of GraphQL](https://hasura.io/blog/rest-view-of-graphql/)
2. [Shipping 'Belonging' with GraphQL & Apollo at Airbnb (Adam Neary)](https://www.youtube.com/watch?v=JsvElHDuqoA)
3. [GraphQL: The Mental Model — Dhaivat Pandya](https://www.youtube.com/watch?v=zWhVAN4Tg6M)
4. [Apollo GraphQL](https://apollographql.com/)
5. [Apollo Federation](https://www.apollographql.com/docs/federation/federation-spec/)
6. [schema-registry](https://github.com/pipedrive/graphql-schema-registry)