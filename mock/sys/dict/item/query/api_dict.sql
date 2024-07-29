/*==============================================================*/
/* DBMS name:      ORACLE Version 11g                           */
/* Created on:     2019/7/17 10:48:53                           */
/*==============================================================*/

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_PARA_TYPE', '参数类型', '0', '@', 'API接口或BEX接口的参数类型：入参或者出参');

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_TYPE', '-1', '1', '入参', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_TYPE', '-1', '2', '出参', 1, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_PARA_REQUIRED', '参数是否必传', '0', '@', 'API接口或BEX接口的参数类型：入参或者出参');

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_REQUIRED', '-1', '0', '否', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_REQUIRED', '-1', '1', '是', 1, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_PARA_POS', '参数位置', '0', '@', 'API接口或BEX接口的参数类型：入参或者出参');

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_POS', '-1', '1', 'head', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_POS', '-1', '2', 'body', 1, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_PARA_DATA_TYPE', '参数数据类型', '0', '@', 'API接口或BEX接口的参数类型：入参或者出参');

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_DATA_TYPE', '-1', '1', 'int', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_DATA_TYPE', '-1', '2', 'long', 1, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_DATA_TYPE', '-1', '3', 'String', 2, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_PARA_REF_TYPE', '参数引用类型', '0', '@', 'API接口或BEX接口的参数类型：入参或者出参');

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_REF_TYPE', '-1', '0', '不翻译', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_REF_TYPE', '-1', '1', '数据字典', 1, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_PARA_REF_TYPE', '-1', '2', '翻译项', 2, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_SERVICE_TYPE', '服务类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_SERVICE_TYPE', '-1', '0', '其他服务', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_SERVICE_TYPE', '-1', '1', '基础服务', 1, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_SERVICE_TYPE', '-1', '2', '业务服务', 2, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_EXAMPLE_TYPE', '示例类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_EXAMPLE_TYPE', '-1', '1', '请求示例', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_EXAMPLE_TYPE', '-1', '2', '响应示例', 1, null);


insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_BEX_TYPE', 'BEX接口类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '1', 'JAVA', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '2', 'MYBATIS', 1, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '3', 'KJDP', 2, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '4', 'KJAX', 3, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '5', 'JROS', 4, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '6', 'KCBP', 5, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_BEX_PAGE_ABLE', 'BEX接口分页类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_PAGE_ABLE', '-1', '0', '不分页', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_PAGE_ABLE', '-1', '1', '分页', 1, null);


insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_API_TYPE', 'API HTTP 请求方法', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_API_TYPE', '-1', '1', 'GET', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_API_TYPE', '-1', '2', 'POST', 1, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_API_TYPE', '-1', '3', 'PUT', 2, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_API_TYPE', '-1', '4', 'DELETE', 3, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_TOKEN_CATE', 'API接口Token类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_TOKEN_CATE', '-1', '1', '如无携带token，生成token', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_TOKEN_CATE', '-1', '2', '无需携带token，不生成token', 1, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_TOKEN_CATE', '-1', '3', '需携带token，不销毁token', 2, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_TOKEN_CATE', '-1', '4', '需携带token，销毁token', 3, null);
