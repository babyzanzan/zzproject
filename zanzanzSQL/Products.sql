USE [Bz3PL]
GO

/****** Object:  Table [dbo].[Products]    Script Date: 2023/9/28 15:05:21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Products](
	[PID] [int] IDENTITY(1,1) NOT NULL,
	[OwnerID] [int] NOT NULL,
	[ProductTypeID] [int] NULL,
	[RPID] [nvarchar](20) NOT NULL,
	[PCode] [nvarchar](50) NULL,
	[BarCode] [nvarchar](50) NULL,
	[PName] [nvarchar](100) NOT NULL,
	[ProductName] [nvarchar](100) NULL,
	[TYName] [nvarchar](50) NULL,
	[PYName] [nvarchar](50) NULL,
	[WBName] [nvarchar](50) NULL,
	[UnitType] [nvarchar](30) NULL,
	[Alias] [nvarchar](100) NULL,
	[AliasExpiryDate] [datetime] NULL,
	[Model] [nvarchar](100) NULL,
	[ListingHolder] [nvarchar](200) NULL,
	[FromPlaceID] [nvarchar](50) NULL,
	[FromPlace] [nvarchar](200) NULL,
	[ShortFromPlace] [nvarchar](80) NULL,
	[BaseUnit] [nvarchar](8) NULL,
	[UnitRate] [int] NOT NULL,
	[MidUnitRate] [int] NULL,
	[RetailBaseUnit] [nvarchar](8) NULL,
	[RetailUnitRate] [int] NULL,
	[ShelfLifeYear] [int] NULL,
	[ShelfLifeMonth] [int] NULL,
	[Status] [int] NULL,
	[WareID] [int] NULL,
	[MinInv] [int] NULL,
	[MaxInv] [int] NULL,
	[CommissioningFromPlace] [nvarchar](200) NULL,
	[CommissioningExpiryDate] [datetime] NULL,
	[GMPNo] [nvarchar](50) NULL,
	[GMPExpiryDate] [datetime] NULL,
	[ProductLic] [nvarchar](50) NULL,
	[PuRate] [money] NULL,
	[LsPrice] [money] NULL,
	[PFPrice] [money] NULL,
	[IsDrug] [int] NULL,
	[IsSpecial] [bit] NULL,
	[IsDoubleCheck] [bit] NULL,
	[IsColdStorage] [bit] NULL,
	[IsImported] [bit] NULL,
	[IsMaintenance] [bit] NULL,
	[MaintenanceExpiryDate] [datetime] NULL,
	[IsDoubleTax] [bit] NULL,
	[Volume] [money] NULL,
	[Applications] [nvarchar](2000) NULL,
	[Storage] [nvarchar](2000) NULL,
	[Utility] [nvarchar](2000) NULL,
	[ExamineItems] [nvarchar](2000) NULL,
	[QualityStandard] [nvarchar](2000) NULL,
	[QualityConfim] [nvarchar](2000) NULL,
	[PackageInstructions] [nvarchar](2000) NULL,
	[Note] [nvarchar](200) NULL,
	[PermitHolder] [nvarchar](50) NULL,
	[TransEnv] [nvarchar](50) NULL,
 CONSTRAINT [PK_Level5Products] PRIMARY KEY CLUSTERED 
(
	[PID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY],
 CONSTRAINT [IX_Level5Products] UNIQUE NONCLUSTERED 
(
	[PCode] ASC,
	[PID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF_Level5Products_Status]  DEFAULT ((1)) FOR [Status]
GO

ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF_Products_WareID]  DEFAULT ((0)) FOR [WareID]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'货主ID' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'OwnerID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'药品类别,关联ProductTypes表' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'ProductTypeID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'RPID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'商品编码' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'PCode'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'条码' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'BarCode'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'品名' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'PName'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'商品名' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'ProductName'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'通用名' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'TYName'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'拼音首字母' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'PYName'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'五笔首字典' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'WBName'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'剂型' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'UnitType'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'批准文号' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Alias'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'批准文号有效期' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'AliasExpiryDate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'规格' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Model'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'药品上市许可持有人' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'ListingHolder'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'生产企业' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'FromPlace'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'产地' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'ShortFromPlace'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'单位' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'BaseUnit'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'大包装' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'UnitRate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'中包装' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'MidUnitRate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'零售单位' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'RetailBaseUnit'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'批零转换率' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'RetailUnitRate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'有效期:年' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'ShelfLifeYear'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'有效期:月' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'ShelfLifeMonth'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'状态' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Status'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'库区' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'WareID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'最低库存' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'MinInv'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'最高库存' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'MaxInv'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'商品委托生产企业' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'CommissioningFromPlace'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'商品委托生产期限' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'CommissioningExpiryDate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'生产企业GMP' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'GMPNo'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'生产企业GMP有效期' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'GMPExpiryDate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'生产许可证/备案凭证号' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'ProductLic'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'税率' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'PuRate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'零售价' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'LsPrice'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'批发价' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'PFPrice'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'是否监管码' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'IsDrug'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'特管药品' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'IsSpecial'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'双人验收复核' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'IsDoubleCheck'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'是否冷藏' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'IsColdStorage'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'进口药品' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'IsImported'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'重点养护' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'IsMaintenance'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'重点养护到期时间' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'MaintenanceExpiryDate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'是否两票制商品' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'IsDoubleTax'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'整件体积' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Volume'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'性状' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Applications'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'储存条件' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Storage'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'用途' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Utility'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'检验项目' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'ExamineItems'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'质量标准' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'QualityStandard'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'主要成分' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'QualityConfim'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'备注' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Products', @level2type=N'COLUMN',@level2name=N'Note'
GO


