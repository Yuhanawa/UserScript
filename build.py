# 检查是否存在out文件夹不存在就创建

import os
import shutil
import re




if not os.path.exists('out'):
    os.mkdir('out')

files = [
    'src/csdn.js',
]

for f in files:
    # 将f复制到out下

    index = f.rfind('.')
    if index != -1:
        out_file = f'out/{f[:index]}.out{f[index:]}'
    else:
        out_file += f'out/{f}.out'

    out_path = re.sub('/[^/]*$', '', out_file)
    if not os.path.exists(out_path):
        os.mkdir(out_path)

    shutil.copy(f, out_file)
    print(f'copy {f} to out')


    # 通过正则表达式匹配 //#import /src/utils.js#
    # 读取/src/utils.js 并替换  //#import /src/utils.js#
    with open(out_file, 'r+',encoding='utf-8') as fp:
        str = fp.read()
        matches = re.findall(r'/\*#import .*#\*/', str)
        for match in matches:
            import_path = match[10:-3].strip()
            # read import_path
            with open(import_path, 'r',encoding='utf-8') as f:
                s = f.read()
                str = str.replace(match, s)
        fp.seek(0)
        fp.write(str)
        fp.truncate()

