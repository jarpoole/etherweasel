#!/bin/sh

ffmpeg -f h264 -i - -vf "drawbox=x=582:y=360:w=195:h=120:color=black@1:t=fill" -f h264 -
