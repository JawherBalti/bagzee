<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230330125646 extends AbstractMigration
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
        $this->addSql('ALTER TABLE baggagite ADD point_relais_depart_id INT DEFAULT NULL, ADD point_relais_arrivee_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE baggagite ADD CONSTRAINT FK_E01318ED84329575 FOREIGN KEY (point_relais_depart_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE baggagite ADD CONSTRAINT FK_E01318ED2BBB5382 FOREIGN KEY (point_relais_arrivee_id) REFERENCES client (id)');
        $this->addSql('CREATE INDEX IDX_E01318ED84329575 ON baggagite (point_relais_depart_id)');
        $this->addSql('CREATE INDEX IDX_E01318ED2BBB5382 ON baggagite (point_relais_arrivee_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE images (id INT AUTO_INCREMENT NOT NULL, advert_id INT DEFAULT NULL, url LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, INDEX IDX_E01FBE6AD07ECCB6 (advert_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AD07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('ALTER TABLE baggagite DROP FOREIGN KEY FK_E01318ED84329575');
        $this->addSql('ALTER TABLE baggagite DROP FOREIGN KEY FK_E01318ED2BBB5382');
        $this->addSql('DROP INDEX IDX_E01318ED84329575 ON baggagite');
        $this->addSql('DROP INDEX IDX_E01318ED2BBB5382 ON baggagite');
        $this->addSql('ALTER TABLE baggagite DROP point_relais_depart_id, DROP point_relais_arrivee_id');
    }
}
