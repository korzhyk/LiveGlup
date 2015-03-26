#LiveGulp

Даний інтрумент дозволяє оптимізувати роботу front-end спеціалістів, а також заощадити час.
###Інструменти:
* jade - препроцесор html
* stylus (with nib) - препроцеcор css
* coffee - препроцесор для js
* connect - веб сервер
* imagemin - оптимізація зображень (jpeg, png, gif, svg)
* livereload - автоматичне оновлення файлів css, js, html при редагуванні. Використовуйте html сніпет для jade ```script(src="http://127.0.0.1:35729/livereload.js?&extver=2.0.9")``` або встановіть [додаток](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) для вашого веб-переглядача.

#Інсталяція (термінал)
0. Встановіть [nodejs](https://nodejs.org/) та [git](http://git-scm.com/)
1. Завантажте репозиторій `git clone https://github.com/korzhyk/LiveGlup.git`
2. Встановіть необхідні модулі `npm i`
3. Запустіть `gulp`

#Bower
Для роботи з bower компонентами варто лише в папці `src` виконати встановлення потрібного вам компонента `bower install jquery`. _Не забудьте_ підключити потрібні скрипти та стилі в вашому `jade` документі.
