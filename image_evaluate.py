#!/usr/bin/python
import numpy as np
import pandas as pd
import json
import sys

expected = pd.read_csv(sys.argv[1], sep=' ')
predicted = pd.read_csv(sys.argv[2], sep=' ')

joined = expected.merge(predicted,
                       how='left',
                       on=['ad_id', 'image_path'],
                       suffixes=('_expected', '_predicted'))

print (joined.cat_id_expected == joined.cat_id_predicted).mean()
