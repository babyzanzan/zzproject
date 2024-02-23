USE [Bz3PL]
GO

/****** Object:  Table [dbo].[ClientCardTypes]    Script Date: 2023/9/27 15:06:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ClientCardTypes](
	[CardTypeID] [int] NOT NULL,
	[CardTypeName] [nvarchar](100) NULL,
	[MsgTypeID] [int] NULL,
	[CType] [int] NULL,
	[bCustomer] [bit] NULL,
	[bSupplier] [bit] NULL,
	[bOwners] [bit] NULL
) ON [PRIMARY]
GO


