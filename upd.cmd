@echo off
title UPDATE REPO 
color 0a
echo ENTER COMMITMENT MESSAGE (DO NOT USE SPECIAL CHARACTERS):
set /P cmessage=
echo ...
echo.
git add .
git commit -m %cmessage%
git push
echo.
echo Commits pushed to repo - page will not load new data because it is not built or there is cache that needs to be refreshed.
pause
exit