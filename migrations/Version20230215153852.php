<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230215153852 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE object_transport DROP FOREIGN KEY FK_25141EA9D07ECCB6');
        $this->addSql('DROP INDEX IDX_25141EA9D07ECCB6 ON object_transport');
        $this->addSql('ALTER TABLE object_transport DROP advert_id');
        $this->addSql('ALTER TABLE object_type DROP FOREIGN KEY FK_11CB6B3AD07ECCB6');
        $this->addSql('DROP INDEX IDX_11CB6B3AD07ECCB6 ON object_type');
        $this->addSql('ALTER TABLE object_type DROP advert_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE object_transport ADD advert_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE object_transport ADD CONSTRAINT FK_25141EA9D07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('CREATE INDEX IDX_25141EA9D07ECCB6 ON object_transport (advert_id)');
        $this->addSql('ALTER TABLE object_type ADD advert_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE object_type ADD CONSTRAINT FK_11CB6B3AD07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('CREATE INDEX IDX_11CB6B3AD07ECCB6 ON object_type (advert_id)');
    }
}
