# Create_USERS
В этом проекте была реализована клиентская часть, которая имела форму заполнения данных(ИМЯ, ФАМИЛИЯ, ВОЗРАСТ), кнопку создать. И серверная част,ь написанная на node.js express, в котором была реализована CRUD пользователей.

При первоначальной загрузке страницы выводятся все сохраненные пользователи из БД(postgreSQL), методом GET:
  ![image](https://github.com/ZinnatullinDA/Create_USERS/assets/99118170/20bc56c8-9f9e-4d67-9cc4-eb8d68c3bc93)



После заполнение полей и нажатия на кнопку создается пользователь, который заносится в БД(postgreSQL) методом POST.
  ![image](https://github.com/ZinnatullinDA/Create_USERS/assets/99118170/58d1f40b-7503-47b3-b33a-2238dd602cf4)



Пользователей можно редактировать(метод PATCH) и удалять(метод DELETE):
  ![image](https://github.com/ZinnatullinDA/Create_USERS/assets/99118170/79ad275b-9c0a-4589-ab82-9f259e445099)

  


