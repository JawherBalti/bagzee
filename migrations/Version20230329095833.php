<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230329095833 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6AD07ECCB6');
        $this->addSql('DROP TABLE images');
        $this->addSql('ALTER TABLE advert_query ADD lat_adresse_point_depart DOUBLE PRECISION NOT NULL, ADD long_adresse_point_depart DOUBLE PRECISION NOT NULL, ADD lat_adresse_point_arrivee DOUBLE PRECISION NOT NULL, ADD long_adresse_point_arrivee DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE baggiste_query ADD lat_adresse_point_depart DOUBLE PRECISION NOT NULL, ADD long_adresse_point_depart DOUBLE PRECISION NOT NULL, ADD lat_adresse_point_arrivee DOUBLE PRECISION NOT NULL, ADD long_adresse_point_arrivee DOUBLE PRECISION NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE images (id INT AUTO_INCREMENT NOT NULL, advert_id INT DEFAULT NULL, url LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, INDEX IDX_E01FBE6AD07ECCB6 (advert_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AD07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('ALTER TABLE advert_query DROP lat_adresse_point_depart, DROP long_adresse_point_depart, DROP lat_adresse_point_arrivee, DROP long_adresse_point_arrivee');
        $this->addSql('ALTER TABLE baggiste_query DROP lat_adresse_point_depart, DROP long_adresse_point_depart, DROP lat_adresse_point_arrivee, DROP long_adresse_point_arrivee');
    }
}
