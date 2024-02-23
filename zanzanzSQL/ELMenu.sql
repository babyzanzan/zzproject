USE [Bz3PL]
GO

/****** Object:  Table [dbo].[ElMenu]    Script Date: 2023/9/26 10:33:03 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ElMenu](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[path] [nvarchar](50) NOT NULL,
	[component] [text] NOT NULL,
	[redirect] [nvarchar](100) NOT NULL,
	[name] [varchar](50) NOT NULL,
	[meta] [varchar](100) NOT NULL,
	[children] [text] NOT NULL,
	[active] [bit] NOT NULL,
 CONSTRAINT [PK__ElMenu__3214EC070737E4A2] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[ElMenu] ADD  CONSTRAINT [DF__ElMenu__Visible__0A14514D]  DEFAULT ((0)) FOR [redirect]
GO

ALTER TABLE [dbo].[ElMenu] ADD  CONSTRAINT [DF__ElMenu__Icon__0B087586]  DEFAULT ('') FOR [name]
GO

ALTER TABLE [dbo].[ElMenu] ADD  CONSTRAINT [DF__ElMenu__Router__0BFC99BF]  DEFAULT ('') FOR [meta]
GO

ALTER TABLE [dbo].[ElMenu] ADD  CONSTRAINT [DF__ElMenu__Descript__0CF0BDF8]  DEFAULT ('') FOR [children]
GO

ALTER TABLE [dbo].[ElMenu] ADD  CONSTRAINT [DF_ElMenu_active]  DEFAULT ((1)) FOR [active]
GO


