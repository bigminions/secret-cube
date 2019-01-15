# -*- coding: utf-8 -*-
import os

def check_modules (dir):
    check_dir = os.path.join(dir, 'node_modules')
    # 假如文件夹内包含node_modules，递归检查
    if os.path.exists(check_dir):
        print ('now will check {}'.format(check_dir))
        packages = []
        for f in os.listdir(check_dir):
            f = os.path.join(check_dir, f)
            if (os.path.isdir(f)):
                packages.append(f)
        for f in packages:
            try:
                check_modules(f)
            except Exception as e:
                print(e)
                print('delete this package from current dir : {}'.format(f))
                os.remove(f)
    # 尝试打开文件夹，打不开删除该文件夹
    else:
        try:
            os.listdir(dir)
        except Exception as e:
            print('delete this package from current dir : {}, cause {} '.format(dir, e))
            os.remove(f)

check_modules('.')
    


