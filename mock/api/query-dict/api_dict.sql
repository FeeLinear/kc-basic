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
values ('API_SERVICE_TYPE', '服务类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_SERVICE_TYPE', '-1', '1', '公共服务', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_SERVICE_TYPE', '-1', '2', '私有服务', 1, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_EXAMPLE_TYPE', '示例类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_EXAMPLE_TYPE', '-1', '1', '请求示例', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_EXAMPLE_TYPE', '-1', '2', '响应示例', 1, null);


insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_BEX_TYPE', 'BEX接口类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '1', 'SP', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '2', 'LBM', 1, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_TYPE', '-1', '3', 'JAVABEAN', 1, null);

insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_BEX_PAGE_ABLE', 'BEX接口分页类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_PAGE_ABLE', '-1', '0', '不分页', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_BEX_PAGE_ABLE', '-1', '1', '分页', 1, null);


insert into sys_dictionary (DICT_CODE, DICT_NAME, DICT_TYPE, MAINTAIN_FLAG, REMARK)
values ('API_API_TYPE', 'API接口类型', '0', '@', null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_API_TYPE', '-1', '1', 'GET', 0, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_API_TYPE', '-1', '2', 'POST', 1, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_API_TYPE', '-1', '3', 'PUT', 2, null);

insert into sys_dictionary_item (DICT_CODE, ORG_CODE, DICT_ITEM, DICT_ITEM_NAME, DICT_ORD, REMARK)
values ('API_API_TYPE', '-1', '4', 'DELETE', 3, null);
