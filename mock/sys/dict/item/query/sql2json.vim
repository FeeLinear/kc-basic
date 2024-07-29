:g/insert/d
:g/^\//d
:g/^$/d
:%s/values (//
:%s/);//
:g/^'[A-Z0-9_]\+', '[^-1]\+'/d
:%s/^\('[A-Z0-9_]\+'\), \('-1'\), \('[^']\+'\), \('[^']\+'\), \([0-9]\+\), \(.*\)$/{ "dictCode": \1, "orgCode": \2, "dictItem": \3, "dictItemName": \4, "dictOrd": \5, "remark": \6 },/
%s/'/"/g
