<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230220132034 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE advert_query (id INT AUTO_INCREMENT NOT NULL, client_id INT DEFAULT NULL, advert_id INT DEFAULT NULL, price DOUBLE PRECISION NOT NULL, status INT NOT NULL, INDEX IDX_2C99A88719EB6921 (client_id), INDEX IDX_2C99A887D07ECCB6 (advert_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE advert_query ADD CONSTRAINT FK_2C99A88719EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE advert_query ADD CONSTRAINT FK_2C99A887D07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('DROP TABLE admin');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE advert_query DROP FOREIGN KEY FK_2C99A88719EB6921');
        $this->addSql('ALTER TABLE advert_query DROP FOREIGN KEY FK_2C99A887D07ECCB6');
        $this->addSql('DROP TABLE advert_query');
    }
}
