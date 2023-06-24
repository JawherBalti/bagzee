nothing:
	# No action provided : install, update, start or stop #

install:
	/usr/local/bin/docker-compose build
	/usr/local/bin/docker-compose run webpack yarn install
	/usr/local/bin/docker-compose up -d
        /usr/local/bin/docker-compose exec db mysql -uroot -proot -e "GRANT ALL ON bagzee.* TO 'bagzee'@'%'"
	make update

update:
	/usr/local/bin/docker-compose exec php composer install --prefer-dist --no-progress --no-interaction



	#docker-compose exec php bin/console doctrine:fixtures:load --no-interaction
	#docker-compose exec php bin/console doctrine:migrations:migrate --no-interaction --env=test
	#docker-compose exec php bin/console doctrine:fixtures:load --no-interaction --env=test
	#docker-compose exec php bin/console ckeditor:install --no-interaction

	docker-compose exec php bin/console asset:install --symlink --relative --no-interaction
	docker-compose exec webpack yarn install


 
        docker-compose exec webpack yarn encore dev
 
	docker-compose exec webpack yarn run dev-server
	docker-compose exec webpack yarn encore dev --watch
 


 
	docker-compose exec webpack yarn encore production
	#docker-compose exec webpack yarn encore dev --watch


	#docker-compose exec php bin/console doctrine:migrations:migrate --no-interaction

start:
	/usr/local/bin/docker-compose up -d

stop:
	docker-compose stop
